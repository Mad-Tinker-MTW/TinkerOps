# TinkerOps Workers

Automation workers for the MTW workshop. Each worker reads the registry
(`../data/registry.json`, the source of truth) and does one reliable chore so the
operator does not have to remember to. These are the functional core of the
overseer: dumb, dependable workers that keep the bookkeeping honest while you
build. Stdlib-only Python, no dependencies.

## mtw_vcs.py — version-control hygiene

Keeps every project's git state honest so unprotected work cannot rot on disk.

```
python scripts/mtw_vcs.py scan                # read-only status of every project
python scripts/mtw_vcs.py protect [--dry-run] # git-init + safe first commit for no-git projects
python scripts/mtw_vcs.py snapshot [--dry-run]# commit uncommitted work as a WIP snapshot
python scripts/mtw_vcs.py refresh [--dry-run] # update each record's last_commit from git
```

Run from the TinkerOps root (or anywhere; it resolves the registry by its own
path). Any Python 3.11+, or `uv run python scripts/mtw_vcs.py scan`.

Safety on every mutating command:
- Secrets are never committed. A `.gitignore` is written before staging, and a
  post-stage guard refuses to commit any secret-named file (`.env`, `credentials`,
  `*.key`, `*.pem`, `config.toml`, ...) even if the ignore misses it. Templates
  (`.env.example`, `*.sample`) are kept.
- Files over 20 MB are excluded.
- `.obsidian` is never read or committed.
- Nothing is ever pushed to a remote.
- `--dry-run` previews without writing.

`scan` is always safe to run. The mutating commands were used in the 2026-06-06
safety sweep that brought 24 projects under version control with zero secrets
committed.

## Planned workers
- Registry audit: flag stale records, status drift, and projects whose code path is empty.
- Doc coverage: report which projects are missing the standard MTW docs.
- Port map: list what runs on which local port, from each record's `port` field.

These are the first bricks of the functional overseer (the achievable version of
Hex-Veridicae): workers that run without the operator's attention and report back.
