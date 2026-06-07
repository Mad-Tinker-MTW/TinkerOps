# TinkerOps — Known Issues

---

## Open

None currently tracked.

---

## Closed

**Build break: registry imports used lowercase `../data/`**
`src/App.tsx` imported `../data/registry.json` and `../data/pipeline-state.json`, but the directory is `Data/`. Resolved fine on case-insensitive Windows but failed `tsc`/`vite build` and any Linux/CI run with `TS2307: Cannot find module`.
Fixed: imports now reference `../Data/` to match the actual directory case. CLAUDE.md note clarified the capital-D requirement. 2026-06-07.

**registry.json `_meta` counts out of sync**
`_meta` reported `total: 43` (actual 41) and stale per-status counts (dormant 7→14, triage 16→5, active 10→11, pre-build 3→4); the dashboard StatCards and header read these directly, so it displayed wrong totals. `version`/`generated` were also stuck at the 1.0.0 initial build.
Fixed: recomputed all `_meta` counts from the project array, bumped version to 1.0.6 and generated to 2026-06-07. 2026-06-07.

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
