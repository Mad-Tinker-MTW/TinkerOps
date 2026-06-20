# TinkerOps — Specification
**MTW Workshop Dev Console**
Version: 1.1.0

---

## What It Is

A local React dashboard that reads registry.json as its single source of truth and gives the workshop operator a unified view of every MTW project. No auth, no external calls. Loads in seconds, reflects reality on reload, and never gets in the way.

The build artifact has no backend. The one deliberate exception is a set of localhost-only middleware endpoints that exist only under `bun run dev` (Vite `configureServer`): project launch, log reading, health probing, and card-order persistence. They never run in a production build and never bind to a non-localhost host. See Dev-Server Endpoints below.

Paired with the Claude Code slash-command agents (now SKILL.md skills at `Q:\MTW\.claude\skills\`) that govern project auditing, documentation, deployment, and checkpoint logging across the entire workshop.

---

## Stack

| Layer | Tech |
|---|---|
| Frontend | React 18, Vite 5, TypeScript 5 |
| Styling | Tailwind CSS 3 |
| Package manager | bun |
| Build tool | Vite |
| Data source | Data/registry.json (local JSON, read at runtime) |
| Pipeline data | Data/pipeline-state.json (written by the TinkerPipeline runner, read at runtime) |
| UI state | Data/ui-order.json (manual card order, written by the dev-server /api/order endpoint) |
| Markdown | marked (in-app log rendering) |
| Backend | None in build; localhost dev-server middleware under bun run dev only |
| Auth | None |
| Port | 5175 |

---

## Data Model

Source: `Q:\MTW\TinkerOps\Data\registry.json`
Schema: `Q:\MTW\TinkerOps\Data\PROJECT.schema.json`

Each project record:

| Field | Type | Description |
|---|---|---|
| id | string | Unique project identifier |
| name | string | Display name |
| status | enum | active / dormant / pre-build / placeholder / complete / archived / triage |
| division | string or null | MTW division (Foundry, GemLab, Tools, etc.) |
| path | string | Primary filesystem path |
| alt_path | string or null | Secondary path (e.g. placeholder pointing to live code) |
| stack | string[] | Technology list |
| package_manager | string or null | bun / uv / cargo / npm |
| deployment | string[] | Deployment targets |
| urls | object | production / staging / local URLs |
| github | string or null | Mad-Tinker-MTW/repo-name |
| docs | object | readme / claude_md / status_md / pmp / obsidian_note flags |
| pmp_ids | string or null | PMP document ID prefix |
| launch | string or null | Launch script filename |
| launch_cmd | string or null | Command to run the project |
| port | number or null | Dev server port |
| last_worked | string or null | YYYY-MM-DD |
| last_commit | string or null | YYYY-MM-DD |
| summary | string | One-paragraph project description |
| tags | string[] | Searchable tags |
| blocked_by | string or null | Project ID this project depends on |
| triage_needed | boolean | Surfaces project in triage view |
| notes | string or null | Session carry-over notes |

### Pipeline State

Source: `Q:\MTW\TinkerOps\Data\pipeline-state.json`
Schema: `Q:\MTW\TinkerOps\Data\PIPELINE_STATE.schema.json`

A separate file, keyed by project id, written by the TinkerPipeline runner at each
phase transition. The dashboard reads it alongside the registry and never writes it.
Per-project entry:

| Field | Type | Description |
|---|---|---|
| phase | enum | idle / plan / execute / awaiting-audit / audit |
| status | enum | ok / running / failed |
| last_run | string | ISO 8601 UTC timestamp |
| plan_file | string or null | Plan the runner executed |
| tasks_total / tasks_complete / tasks_failed / tasks_skipped | number | Task counts for the run |
| last_task | string or null | ID of the last task acted on |
| last_commit | string or null | Hash of the last commit produced |
| runner_version | string or null | Runner version that wrote the state |

---

## Views and Components

| Module | Description | Status |
|---|---|---|
| Overview | All projects as cards with stat summary, plus name/tag/status/stack search | Complete |
| Triage | Filtered view of triage_needed projects with missing-field flags | Complete |
| Wiring | Division grouping (incl. Creative) and blocked-by dependency chains in build order | Complete |
| StatCards | Active / dormant / pre-build / triage counts | Complete |
| ProjectCard | Status badge, stack pills, doc coverage, deployment icons, pipeline pill, live URL + health dot, editable order badge | Complete |
| StatusBadge | Color-coded status indicator | Complete |
| PipelinePill | Pipeline phase and status with task counts, color-coded, pulses while running | Complete |
| DocCoverage | Visual doc coverage flags (readme, claude_md, status_md, pmp) | Complete |
| StackPill | Technology tag pill | Complete |
| DeploymentIcons | Deployment target icon set with unknown-target fallback | Complete |
| ProjectDetail | Full registry record panel: pipeline state, blocked-by/dependents, copy-able launch command, Logs section | Complete |
| LogViewer | In-app markdown viewer for a project's dated session reports and master log | Complete |

---

## Dev-Server Endpoints

Localhost-only middleware registered in `vite.config.ts` via Vite `configureServer`. These run only under `bun run dev`, never in a production build, and the dev server must stay bound to localhost while they are enabled (the launch endpoint spawns local processes). Each is the deliberate, scoped exception to the no-backend rule.

| Endpoint | Method | Purpose |
|---|---|---|
| /api/launch | POST { id } | Spawn the project's own launch_cmd at its path in a new console. Never runs a client-supplied command string; looks the command up in registry.json by id. |
| /api/logs | GET ?id | List a project's dated session reports (from Docs/TinkerOps/sessions) and its master log (Docs/TinkerOps/logs/<id>-LOG.md). |
| /api/logfile | GET ?rel | Return the raw markdown of one log file. Path is sanitized to the Docs/TinkerOps base dir and limited to .md (no traversal). |
| /api/health | POST { urls[] } | Server-side reachability probe of the given URLs (dodges browser CORS). A server that answers at all is up; a refused connection is down. |
| /api/order | GET / POST | Read and persist the manual per-section card order to Data/ui-order.json. |

## Hooks

| Hook | Purpose |
|---|---|
| useHealth | Polls /api/health every 15s for a set of local URLs; returns an up/down/unknown map for the card status dots. |
| useOrder | Loads and persists manual card order via /api/order; exposes per-project rank and an insert-and-shift reorder. |
| useUATFlags | Per-browser localStorage store for the UAT coursework toggle. |

## Claude Code Agents

The governance agents now live as SKILL.md skills at `Q:\MTW\.claude\skills\` (migrated 2026-06-14 from the old `.claude\commands\*.md` format; trigger-phrase frontmatter lets them fire on natural language, not just slash invocation):

| Agent | Command | Purpose |
|---|---|---|
| Standup | /standup | Morning re-entry briefing: read journal + registry, return a prioritized agenda |
| Audit | /audit-project | Scan project, assess doc coverage, flag anomalies, update registry |
| New | /new-project | Scaffold a new MTW project from scratch |
| Doc | /doc-project | Generate or catch up documentation including full PMP suite |
| Deploy | /deploy-project | Handle deployment for any MTW deployment target |
| Checkpoint | /checkpoint | Log hours, write journal entry, update registry, confirm commit (formerly /session-close) |

The same skills path also holds TinkerPipeline agents (/audit-diff, /plan-guard, /plan-project, /integrate, /smoke-test). Those belong to the TinkerPipeline project, not TinkerOps governance, but share the global skills location.

---

## Workers

Stdlib-only Python automation in `scripts/`. Each worker reads the registry as source of truth and does one reliable bookkeeping chore. No dependencies; run with any Python 3.11+ or `uv run`.

| Worker | Purpose |
|---|---|
| mtw_vcs.py | Version-control hygiene across every project: `scan` (read-only status), `protect` (git-init + safe first commit for no-git projects), `snapshot` (commit uncommitted work as WIP), `refresh` (sync each record's last_commit from git). Never commits secrets (`.gitignore` + post-stage guard), skips files >20 MB and `.obsidian`, and never pushes to a remote. |

---

## Environment

No environment variables required. Data/registry.json is fetched at runtime by Vite. No .env file needed.

---

## Known Limitations

- No registry writes from the dashboard: registry updates happen in Claude Code sessions only. The dev-server endpoints write only Data/ui-order.json (card order), never the registry.
- Health dots cover local URLs only; production and staging URLs are not probed.
- Desktop-only, no mobile or responsive layout planned.
- No real-time updates; changes appear on page reload.
- Dev-server endpoints are unavailable in a production build, so logs, health dots, ordering, and launch work only under bun run dev.
