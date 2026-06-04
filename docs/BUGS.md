# TinkerOps — Known Issues

---

## Open

None currently tracked.

---

## Closed

**CLAUDE.md stale data path**
CLAUDE.md referenced `src/data/registry.json` as the data source path. The actual path is `Data/registry.json`.
Fixed: corrected path in CLAUDE.md. 2026-06-04.

**registry.json package_manager and launch_cmd set to pnpm**
The registry record had `package_manager: "pnpm"` and `launch_cmd: "pnpm dev"`. The project uses bun throughout.
Fixed: updated both fields to bun in registry.json. 2026-06-04.

**node_modules installed via pnpm**
node_modules were originally built with pnpm, causing resolution inconsistency with bun.lock.
Fixed: removed node_modules and ran `bun install`. 2026-06-04.

**Docs at project root instead of docs\\**
BUGS, CHANGELOG, ROADMAP, SPEC, and VISION were placed at the project root rather than in docs\ per the MTW standard.
Fixed: moved all five files into docs\. 2026-06-04.

**WBS format not TinkerScheduler-parseable**
PMD-002-WBS.md used `## Phase N` headers and `| Work Package | Description | Est. |` columns, which TinkerScheduler cannot parse.
Fixed: reformatted to `#### 1.X Stage N: Name` headers and `| ID | Task | Status |` columns. 2026-06-04.
