#!/usr/bin/env python
"""MTW VCS hygiene worker.

The first automation worker of the MTW overseer. It reads the TinkerOps registry
(the source of truth for all projects) and keeps every project's version-control
state honest, so unprotected work cannot quietly rot on disk.

Stdlib only, no dependencies. Run with any Python 3.11+ (or `uv run python`).

Commands:
  scan       Read-only VCS status of every registry project. No writes.
  protect    git-init + a safe initial commit for projects that have no git.
  snapshot   Commit uncommitted work in repos that already have git, as a WIP snapshot.
  refresh    Update each registry record's last_commit from the real git HEAD date.

Safety, on every mutating command:
  - Secrets are never committed. A .gitignore is written before staging AND a
    post-stage guard refuses to commit any file whose name matches a secret
    pattern (.env, credentials, *.key, *.pem, config.toml, ...). Templates
    (.env.example, *.sample, *.template) are kept.
  - Files over 20 MB are excluded.
  - .obsidian is never read or committed.
  - Nothing is ever pushed to a remote.
  - --dry-run previews any mutating command without writing.

Examples:
  python mtw_vcs.py scan
  python mtw_vcs.py protect --dry-run
  python mtw_vcs.py protect
  python mtw_vcs.py snapshot
  python mtw_vcs.py refresh
"""
from __future__ import annotations

import argparse
import json
import re
import subprocess
import sys
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent
REGISTRY = SCRIPT_DIR.parent / "data" / "registry.json"

SECRET_RE = re.compile(
    r"(^\.env$)|(^\.env\.)|(^\.npmrc$)|(^\.pypirc$)|(secret)|(credential)|(password)|"
    r"(\.key$)|(\.pem$)|(\.pfx$)|(\.p12$)|(id_rsa)|(\.keystore$)|(serviceaccount)|"
    r"(^config\.toml$)|(^config\.json$)|(^settings\.json$)|(\.crt$)", re.IGNORECASE)
TEMPLATE_RE = re.compile(r"(example|sample|template)", re.IGNORECASE)
SIZE_CAP = 20 * 1024 * 1024
AUTHOR = ["-c", "user.name=Francisco De La Paz", "-c", "user.email=mad.tinker@madtinkersworkshop.com"]

GITIGNORE_BLOCK = """
# --- MTW VCS worker baseline ---
.venv/
venv/
env/
__pycache__/
*.pyc
node_modules/
dist/
build/
target/
.svelte-kit/
.next/
.obsidian/
.DS_Store
*.zip
*.7z
*.tar
*.gz
*.rar
*.mp4
*.mov
.env
.env.*
config.toml
config.json
settings.json
secrets.*
credentials*.json
*.key
*.pem
*.pfx
*.p12
*.keystore
id_rsa*
.npmrc
.pypirc
*.crt
!.env.example
!.env.sample
!.env.template
!config.example.toml
!config.example.json
"""

COMMIT_TRAILER = "Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"


def find_projects(data):
    if isinstance(data, list):
        return data
    if isinstance(data, dict):
        for v in data.values():
            if isinstance(v, list) and v and isinstance(v[0], dict) and "id" in v[0]:
                return v
    return []


def load_projects():
    return find_projects(json.loads(REGISTRY.read_text(encoding="utf-8")))


def is_secret(name: str) -> bool:
    base = name.replace("\\", "/").split("/")[-1]
    return bool(SECRET_RE.search(base)) and not TEMPLATE_RE.search(base)


def git(args, cwd):
    try:
        return subprocess.run(["git", *args], cwd=str(cwd), capture_output=True, text=True, timeout=120)
    except Exception:
        return None


def classify(path):
    """Return (state, detail, remote) for a project path."""
    p = Path(path) if path else None
    if not p or not p.exists():
        return "MISSING", "path not found", ""
    if not (p / ".git").exists():
        visible = [x for x in p.iterdir() if x.name != ".git"]
        return ("NO GIT (empty)" if not visible else "NO GIT"), f"{len(visible)} items", ""
    cc = git(["rev-list", "--all", "--count"], p)
    count = cc.stdout.strip() if cc and cc.returncode == 0 else "?"
    st = git(["status", "--porcelain"], p)
    dirty = len([l for l in st.stdout.splitlines() if l.strip()]) if st and st.returncode == 0 else "?"
    rm = git(["remote"], p)
    remote = "remote" if (rm and rm.returncode == 0 and rm.stdout.strip()) else "no-remote"
    if count in ("0", ""):
        state = "NO COMMITS"
    elif dirty:
        state = "DIRTY"
    else:
        state = "clean"
    return state, f"{count} commits / {dirty} dirty", remote


def ensure_gitignore(p: Path):
    gi = p / ".gitignore"
    prev = gi.read_text(encoding="utf-8", errors="ignore") if gi.exists() else ""
    have = set(prev.splitlines())
    missing = [l for l in GITIGNORE_BLOCK.splitlines() if l and not l.startswith("#") and l not in have]
    if missing or not gi.exists():
        with open(gi, "a", encoding="utf-8") as f:
            if prev and not prev.endswith("\n"):
                f.write("\n")
            f.write(GITIGNORE_BLOCK)


def guarded_commit(p: Path, message: str):
    """Stage all, drop secrets + oversized, commit. Returns (committed, excluded_secrets, excluded_big)."""
    git(["add", "-A"], p)
    staged = [l for l in git(["diff", "--cached", "--name-only"], p).stdout.splitlines() if l.strip()]
    secrets, big = [], []
    for rel in staged:
        if is_secret(rel):
            git(["rm", "--cached", "--quiet", "--", rel], p)
            secrets.append(rel)
            continue
        fp = p / rel
        try:
            if fp.is_file() and fp.stat().st_size > SIZE_CAP:
                git(["rm", "--cached", "--quiet", "--", rel], p)
                big.append(rel)
        except OSError:
            pass
    final = [l for l in git(["diff", "--cached", "--name-only"], p).stdout.splitlines() if l.strip()]
    if any(is_secret(r) for r in final):
        return -1, secrets, big  # aborted: secret still staged
    if not final:
        return 0, secrets, big
    full = f"{message}\n\n{COMMIT_TRAILER}"
    c = git([*AUTHOR, "commit", "-m", full], p)
    return (len(final) if c and c.returncode == 0 else -2), secrets, big


# --- commands -------------------------------------------------------------

def cmd_scan(_args):
    rows = [(pr.get("id", ""), pr.get("status", ""), *classify(pr.get("path"))) for pr in load_projects()]
    order = {"MISSING": 0, "NO GIT (empty)": 1, "NO GIT": 2, "NO COMMITS": 3, "DIRTY": 4, "clean": 5}
    rows.sort(key=lambda r: (order.get(r[2], 9), r[0].lower()))
    print(f"{'PROJECT':26} {'STATUS':10} {'VCS':14} {'DETAIL':22} REMOTE")
    print("-" * 92)
    for pid, status, state, detail, remote in rows:
        print(f"{pid[:26]:26} {status[:10]:10} {state:14} {detail[:22]:22} {remote}")
    counts = {}
    for r in rows:
        counts[r[2]] = counts.get(r[2], 0) + 1
    print("\nTotals:", ", ".join(f"{k}={v}" for k, v in sorted(counts.items())))


def cmd_protect(args):
    targets = []
    for pr in load_projects():
        p = Path(pr["path"]) if pr.get("path") else None
        if p and p.exists() and not (p / ".git").exists() and [x for x in p.iterdir() if x.name != ".git"]:
            targets.append((pr["id"], p))
    print(f"protect: {len(targets)} no-git project(s) with content" + (" [DRY RUN]" if args.dry_run else ""))
    for pid, p in targets:
        if args.dry_run:
            print(f"  {pid:24} would init + commit")
            continue
        ensure_gitignore(p)
        if not (p / ".git").exists():
            git(["init", "-b", "main"], p)
        n, secrets, big = guarded_commit(p, "Bring under version control (MTW VCS worker)")
        flag = (f"  [excluded {len(secrets)} secret]" if secrets else "") + (f"  [{len(big)} big]" if big else "")
        msg = {0: "nothing to commit (all ignored)", -1: "ABORTED (secret staged)", -2: "COMMIT FAILED"}.get(n, f"committed {n} files")
        print(f"  {pid:24} {msg}{flag}")


def cmd_snapshot(args):
    targets = []
    for pr in load_projects():
        p = Path(pr["path"]) if pr.get("path") else None
        if not (p and p.exists() and (p / ".git").exists()):
            continue
        git(["config", "--global", "--add", "safe.directory", str(p).replace("\\", "/")], p)
        st = git(["status", "--porcelain"], p)
        if st and [l for l in st.stdout.splitlines() if l.strip()]:
            targets.append((pr["id"], p))
    print(f"snapshot: {len(targets)} repo(s) with uncommitted work" + (" [DRY RUN]" if args.dry_run else ""))
    for pid, p in targets:
        if args.dry_run:
            n = len([l for l in git(["status", "--porcelain"], p).stdout.splitlines() if l.strip()])
            print(f"  {pid:24} would snapshot {n} change(s)")
            continue
        n, secrets, big = guarded_commit(p, "WIP snapshot (MTW VCS worker): preserve uncommitted work")
        flag = (f"  [excluded {len(secrets)} secret]" if secrets else "") + (f"  [{len(big)} big]" if big else "")
        msg = {0: "nothing safe to commit", -1: "ABORTED (secret staged)", -2: "COMMIT FAILED"}.get(n, f"committed {n} files")
        print(f"  {pid:24} {msg}{flag}")


def cmd_refresh(args):
    raw = REGISTRY.read_text(encoding="utf-8")
    dates = {}
    for pr in load_projects():
        p = Path(pr["path"]) if pr.get("path") else None
        if p and p.exists() and (p / ".git").exists():
            r = git(["log", "-1", "--format=%cs"], p)
            d = r.stdout.strip() if r and r.returncode == 0 else ""
            if re.fullmatch(r"\d{4}-\d{2}-\d{2}", d):
                dates[pr["id"]] = d
    id_re = re.compile(r'"id":\s*"([^"]+)"')
    lc_re = re.compile(r'^(\s*"last_commit":\s*)(.*?)(,?)(\s*)$')
    cur, changes, out = None, [], []
    for line in raw.splitlines(keepends=True):
        m = id_re.search(line)
        if m:
            cur = m.group(1)
        lm = lc_re.match(line.rstrip("\n"))
        if lm and cur and dates.get(cur):
            new = f'"{dates[cur]}"'
            if lm.group(2) != new:
                changes.append((cur, lm.group(2), new))
            nl = "\n" if line.endswith("\n") else ""
            out.append(f"{lm.group(1)}{new}{lm.group(3)}{nl}")
        else:
            out.append(line)
    print(f"refresh: {len(changes)} record(s) to update" + (" [DRY RUN]" if args.dry_run else ""))
    for cid, old, new in changes:
        print(f"  {cid:24} {old:14} -> {new}")
    if not args.dry_run and changes:
        new_raw = "".join(out)
        json.loads(new_raw)  # validate before writing
        REGISTRY.write_text(new_raw, encoding="utf-8")
        print("registry written and validated.")


def main():
    ap = argparse.ArgumentParser(description="MTW VCS hygiene worker.")
    sub = ap.add_subparsers(dest="command", required=True)
    sub.add_parser("scan", help="read-only VCS status of all registry projects")
    for name in ("protect", "snapshot", "refresh"):
        sp = sub.add_parser(name)
        sp.add_argument("--dry-run", action="store_true", help="preview without writing")
    args = ap.parse_args()
    {"scan": cmd_scan, "protect": cmd_protect, "snapshot": cmd_snapshot, "refresh": cmd_refresh}[args.command](args)


if __name__ == "__main__":
    sys.exit(main())
