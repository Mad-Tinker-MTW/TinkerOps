# TinkerOps — Known Issues

---

## Open

**registry.json is statically imported, so edits during a dev session go stale**
`src/App.tsx` does `import registryData from '../Data/registry.json'`. Vite bundles the JSON at server start and Vite's HMR for JSON imports is unreliable, so any registry edit during a live `bun run dev` session is invisible until the dev server is restarted AND `node_modules/.vite` is wiped. Repro: add or edit a project record in `Data/registry.json` while the dev server is running, hard-refresh the browser — the change does not appear. Filed 2026-06-21 when TinkerCast's freshly-added card did not render. Suggested fix: replace the static import with a runtime `fetch('/Data/registry.json')` (served as a public asset) on component mount; costs a sub-100ms request and ends the staleness problem permanently. Alternate fix: a dev-only Vite plugin watching Data/registry.json that triggers full reload on change.

---

## Closed

**DeploymentIcons crash on unknown deployment target**
A project record listed `esp32-firmware` as a deployment target, which was absent from the `ICONS` map. `DeploymentIcons` dereferenced `cfg.label` on `undefined`, and with no error boundary the single bad value crashed the entire Overview.
Fixed: added the `esp32-firmware` icon, the `DeploymentTarget` type member, the schema enum value, and an unknown-target fallback so any unmapped value renders a placeholder instead of throwing. 2026-06-20.

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
