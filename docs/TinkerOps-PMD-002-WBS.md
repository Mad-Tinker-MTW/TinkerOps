# Work Breakdown Structure — TinkerOps
**Project ID:** TinkerOps
**Document:** PMD-002
**Owner:** Francisco De La Paz (Mad Tinker)
**Date:** 2026-06-04

---

## Phase 1 — Core Infrastructure
**Status: Complete**
**Estimated Effort: 45h**

| Work Package | Description | Est. |
|---|---|---|
| 1.0 Project Planning and Architecture | Define MTW governance system, agent architecture, division structure, deployment targets, dashboard requirements | 8h |
| 1.1 Project Scaffolding | Vite + React + TypeScript + Tailwind setup, bun config, vite.config.ts, tsconfig | 2h |
| 1.2 Registry Schema Design | Define PROJECT.schema.json fields, enums, validation rules, and status types | 4h |
| 1.2a Registry Data Population | Research and populate 38 project records from chat history, scan reports, and uploaded documentation | 6h |
| 1.3 TypeScript Types | registry.ts type definitions matching schema exactly | 2h |
| 1.4 Data Load | Runtime JSON fetch of Data/registry.json with error boundary | 2h |
| 1.5 App Shell | Top-level layout, navigation structure, routing between views | 3h |
| 1.6 Overview Stats | StatCards component: active, dormant, pre-build, triage counts derived from registry | 3h |
| 1.7 Project Card | ProjectCard component with name, status badge, stack pills, doc coverage, deployment icons | 4h |
| 1.8 Agent Design and Documentation | Design and write four Claude Code slash command agents: audit-project, new-project, doc-project, deploy-project | 8h |
| 1.9 Infrastructure Setup | Global CLAUDE.md, commands folder structure, TinkerOps CLAUDE.md, start.ps1, git initialization | 2h |
| 1.10 Iteration and Refinement | bun vs npm fixes, commands vs skills folder, PMP requirements, PMI hour standards, multi-role stakeholder language | 3h |

---

## Phase 2 — Views and Components
**Status: Mostly complete, triage and wiring views may need a completion pass**
**Estimated Effort: 17h**

| Work Package | Description | Est. |
|---|---|---|
| 2.1 StatusBadge Component | Color-coded badge for active, dormant, pre-build, triage, placeholder, archived, complete | 2h |
| 2.2 DocCoverage Component | Visual indicator for readme, claude_md, status_md, pmp flags | 2h |
| 2.3 StackPill + DeploymentIcons | Stack tag pills and deployment target icon set | 2h |
| 2.4 Project Detail Panel | ProjectDetail overlay/panel with full registry record display | 4h |
| 2.5 Triage View | Filtered view surfacing all triage_needed projects with recommended actions | 4h |
| 2.6 Wiring View | Division grouping view, blocked-by dependency chain visualization | 3h |

---

## Phase 3 — Polish and Deployment
**Status: Pending**
**Estimated Effort: 13-17h**

| Work Package | Description | Est. |
|---|---|---|
| 3.1 Bun Rebase | Remove pnpm node_modules, run clean bun install, verify all deps resolve | 1h |
| 3.2 Git Initialization | git init, initial commit, push to Mad-Tinker-MTW/TinkerOps | 2h |
| 3.3 Search and Filter | Search bar filtering projects by name, tag, status, or stack | 4h |
| 3.4 Wiring View Completion | Finish dependency chain and division views if incomplete | 4h |
| 3.5 Launch Shortcuts | Quick-launch buttons that copy or run bun commands for each project | 4h |
| 3.6 Documentation | README, CLAUDE.md, STATUS.md, PMP docs complete | 2h |

---

## Total Estimated Effort
**75-79 hours**

Phase 1: 45h (complete)
Phase 2: 17h (mostly complete)
Phase 3: 13-17h (pending)

---

## Actual Hours Log

### 2026-06-04

| Work Package | Description | Hours |
|---|---|---|
| 1.0 Project Planning and Architecture | Define MTW governance system, agent architecture, division structure, deployment targets, dashboard requirements | 8h |
| 1.2 Registry Schema Design | Define PROJECT.schema.json fields, enums, validation rules, and status types | 4h |
| 1.2a Registry Data Population | Research and populate 38 project records from chat history, scan reports, and uploaded documentation | 6h |
| 1.8 Agent Design and Documentation | Design and write four Claude Code slash command agents: audit-project, new-project, doc-project, deploy-project | 8h |
| 1.9 Infrastructure Setup | Global CLAUDE.md, commands folder structure, TinkerOps CLAUDE.md, start.ps1, git initialization | 2h |
| 1.10 Iteration and Refinement | bun vs npm fixes, commands vs skills folder, PMP requirements, PMI hour standards, multi-role stakeholder language | 3h |

**Session Total: 31h**
