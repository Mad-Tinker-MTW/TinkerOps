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
- [ ] Triage view — fully wired and tested (all triage_needed projects surfaced)
- [ ] Wiring view — division grouping and blocked-by dependency chain

---

## Stage 3: Polish and Deployment
Search, launch shortcuts, and completion.

- [x] Bun rebase completed (2026-06-04)
- [x] Git initialized and pushed (2026-06-04)
- [x] Documentation pass complete (2026-06-04)
- [ ] Search and filter by name, tag, status, or stack
- [ ] Wiring view completion (dependency chain visualization)
- [ ] Launch shortcuts — copy or run bun commands per project

---

## Beyond Stage 3

- [ ] PMP log surface — pull actual hours from WBS logs, show project time totals per role
- [ ] Session briefing — pre-session summary generated from registry state
- [ ] Dependency chain alerts — flag blocked projects whose blockers are now complete
- [ ] Quick-edit mode — update notes field directly from the dashboard
- [ ] Registry diff view — show what changed in the last session
- [ ] Doc coverage drift alerts — flag projects with coverage gaps older than 60 days
