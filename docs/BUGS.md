# TinkerOps — Known Issues

---

## Open

_None._

---

## Closed

**registry.json statically imported (stale counts + new projects invisible until rebuild)**
`src/App.tsx` did `import registryData from '../Data/registry.json'`, so Vite bundled the JSON at server start and a registry edit during a live session was invisible until a dev-server restart. Compounded by the header and StatCards reading `_meta.total`/`_meta.active`, which are frozen snapshots written at registry-generation time, so the counts drifted even when the data was current (TinkerCast 73-vs-74). Filed 2026-06-21 when TinkerCast's freshly-added card did not render.
Fixed: added a dev-only `GET /api/registry` endpoint serving `Data/registry.json` fresh; `App.tsx` fetches it on mount with the bundled import as the instant, build-safe fallback. StatCards and the header now derive Total/Active live from `projects[]` instead of `_meta`. Commit 0b0fdd3. 2026-06-21.

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
