# TinkerOps — Roadmap

---

## Stage 1: Core Infrastructure
Initial build. Registry schema, data population, core components, governance agents.

- [x] Project scaffolding (React + Vite + TypeScript + Tailwind, bun)
- [x] Registry schema design (PROJECT.schema.json)
- [x] Registry data population (38+ project records)
- [x] TypeScript types (registry.ts)
- [x] Runtime data load from Data/registry.json
- [x] App shell and navigation structure
- [x] StatCards — active, dormant, pre-build, triage counts
- [x] ProjectCard — status badge, stack pills, doc coverage, deployment icons
- [x] Agent design and documentation (audit, new, doc, deploy, session-close)
- [x] Global CLAUDE.md and TinkerOps CLAUDE.md
- [x] start.ps1 launcher
- [x] bun rebase (node_modules clean install)
- [x] Git initialization and push to Mad-Tinker-MTW/TinkerOps

---

## Stage 2: Views and Components
Dashboard views, detail panel, and filtering.

- [x] StatusBadge — color-coded status indicator
- [x] DocCoverage — visual indicator for readme, claude_md, status_md, pmp flags
- [x] StackPill + DeploymentIcons
- [x] ProjectDetail — full registry record display panel
- [x] Triage view — fully wired and tested (all triage_needed projects surfaced)
- [x] Wiring view — division grouping and blocked-by dependency chain (2026-06-09)

---

## Stage 3: Polish and Deployment
Search, launch shortcuts, and completion.

- [x] Bun rebase completed (2026-06-04)
- [x] Git initialized and pushed (2026-06-04)
- [x] Documentation pass complete (2026-06-04)
- [x] Search and filter by name, tag, status, or stack (Overview search box)
- [x] Wiring view completion (dependency chain visualization) (2026-06-09)
- [x] Launch shortcuts — copy launch command per project (detail panel)

---

## Stage 4: Server-Mode Features
Features for running TinkerOps as an always-on local server (2026-06-20).

- [x] esp32-firmware deployment-target crash fix and unknown-target fallback
- [x] Folder launcher (Launch TinkerOps.bat) and Windows logon autostart task
- [x] In-app Logs feature: dated session viewer and curated master log per project
- [x] Live URL and reachability status dots on cards (server-side health probe)
- [x] Editable per-section card ordering, persisted to Data/ui-order.json
- [x] Registry notes consolidated to a single newest-note with history in the master log

---

## Beyond Stage 4

- [ ] PMP log surface — pull actual hours from WBS logs, show project time totals per role
- [ ] Session briefing — pre-session summary generated from registry state
- [ ] Dependency chain alerts — flag blocked projects whose blockers are now complete
- [ ] Quick-edit mode — update notes field directly from the dashboard
- [ ] Registry diff view — show what changed in the last session
- [ ] Doc coverage drift alerts — flag projects with coverage gaps older than 60 days
