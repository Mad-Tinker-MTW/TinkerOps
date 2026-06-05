# TinkerOps — Specification
**MTW Workshop Dev Console**
Version: 1.0.4

---

## What It Is

A local React dashboard that reads registry.json as its single source of truth and gives the workshop operator a unified view of every MTW project. No backend. No auth. No external calls. Loads in seconds, reflects reality on reload, and never gets in the way.

Paired with five Claude Code slash command agents that govern project auditing, documentation, deployment, and session logging across the entire workshop.

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
| Backend | None |
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
| Overview | All projects as cards with stat summary | Complete |
| Triage | Filtered view of triage_needed projects | Needs completion pass |
| Wiring | Division grouping and blocked-by dependency chain | Needs completion pass |
| StatCards | Active / dormant / pre-build / triage counts | Complete |
| ProjectCard | Status badge, stack pills, doc coverage, deployment icons, pipeline pill | Complete |
| StatusBadge | Color-coded status indicator | Complete |
| PipelinePill | Pipeline phase and status with task counts, color-coded, pulses while running | Complete |
| DocCoverage | Visual doc coverage flags (readme, claude_md, status_md, pmp) | Complete |
| StackPill | Technology tag pill | Complete |
| DeploymentIcons | Deployment target icon set | Complete |
| ProjectDetail | Full registry record display panel, with a pipeline state section | Complete |

---

## Claude Code Agents

Five slash command agents at `Q:\MTW\.claude\commands\`:

| Agent | Command | Purpose |
|---|---|---|
| Audit | /audit-project | Scan project, assess doc coverage, flag anomalies, update registry |
| New | /new-project | Scaffold a new MTW project from scratch |
| Doc | /doc-project | Generate or catch up documentation including full PMP suite |
| Deploy | /deploy-project | Handle deployment for any MTW deployment target |
| Close | /session-close | Log hours, write journal entry, update registry, confirm commit |

The same commands path also holds TinkerPipeline agents (/audit-diff, /plan-guard, and the planned /plan-project). Those belong to the TinkerPipeline project, not TinkerOps governance, but share the global Q:\MTW\.claude\commands\ location.

---

## Environment

No environment variables required. Data/registry.json is fetched at runtime by Vite. No .env file needed.

---

## Known Limitations

- No writes from the dashboard — registry updates happen in Claude Code sessions only
- Desktop-only — no mobile or responsive layout planned
- No real-time updates — changes appear on page reload
- Triage and Wiring views need a Stage 2 completion pass
