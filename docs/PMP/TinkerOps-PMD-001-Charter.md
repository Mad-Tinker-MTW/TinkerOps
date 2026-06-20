# Project Charter
**TinkerOps — MTW Workshop Dev Console**
Document ID: TinkerOps-PMD-001
Version: 1.0
Date: 2026-06-04
Project Manager: Francisco De La Paz

---

## Project Overview

TinkerOps is an internal operations tool developed under Mad Tinker's Workshop (MTW), a division of 4Kings Enterprises. It provides a local React dashboard that reads registry.json as its source of truth and gives the workshop operator a unified view of all active, dormant, triage, and pre-build projects across the workshop. It replaces manual project tracking in notes and removes the cognitive overhead of reconstructing workshop context at the start of every session.

Paired with five Claude Code slash command governance agents, TinkerOps forms the operational backbone of the MTW development process: auditing project state, generating documentation to PMP standard, managing deployments, and closing sessions with proper logging and journal entries.

---

## Business Need

Mad Tinker's Workshop operates 40+ projects across multiple technology stacks, drives, and development phases simultaneously. There was no single source of truth for project status, no automated way to surface what needed triage or documentation, and no consistent session workflow to prevent project drift. Each Claude Code session started from scratch, reconstructing context from memory and chat history.

TinkerOps addresses this by centralizing the project record into a governed, versioned registry and providing a visual interface and agent system that enforces MTW standards at scale.

---

## Objectives

1. Deliver a functional project dashboard reading from registry.json by Stage 1 completion (2026-06-03)
2. Complete all views and components (triage and wiring views) by Stage 2 (Complete 2026-06-09)
3. Add search, launch shortcuts, and wiring view completion by Stage 3 (Complete 2026-06-09)
4. Serve as the authoritative session governance tool for all MTW Claude Code sessions going forward

---

## Scope

### In Scope

- React + Vite + TypeScript + Tailwind dashboard reading registry.json locally
- Project cards, overview stats, triage view, wiring view, and project detail panel
- Doc coverage indicators and deployment badges
- Five Claude Code slash command agents (audit, new, doc, deploy, session-close)
- Pipeline state view: reads pipeline-state.json written by the TinkerPipeline runner and surfaces per-project pipeline phase and status
- Workers: stdlib-only Python automation in scripts/ (mtw_vcs.py VCS-hygiene sweeps) that keep the registry's bookkeeping honest
- Local-only operation, no backend, no auth, no external API calls
- Dark-theme MTW aesthetic

### Out of Scope

- Authentication or multi-user access
- Cloud sync or remote registry storage
- Direct file system writes from the dashboard (registry updates happen in Claude Code sessions)
- Mobile or responsive layout (desktop-only internal tool)
- External API integrations

---

## Deliverables

| Deliverable | Target Date |
|---|---|
| Stage 1: Core Infrastructure — registry, components, governance agents | Complete (2026-06-03) |
| Stage 2: Views and Components — triage, wiring, detail panel | Complete (2026-06-09) |
| Stage 3: Polish and Deployment — search, launch shortcuts | Complete (2026-06-09) |
| Pipeline state integration — reads pipeline-state.json, PipelinePill on cards and detail panel section | Complete (2026-06-05) |

---

## Milestones

| Milestone | Date |
|---|---|
| Project initiated | 2026-06-03 |
| Initial build complete (v1.0.0) | 2026-06-03 |
| Git initialized and pushed to GitHub | 2026-06-04 |
| Documentation suite complete | 2026-06-04 |
| PMP suite established (6 docs) | 2026-06-04 |
| Obsidian vault mirror created | 2026-06-04 |
| Bun rebase complete | 2026-06-04 |
| All docs brought to MTW standard format | 2026-06-04 |

---

## Budget Summary

| Category | Amount |
|---|---|
| Labor — Stage 1 (45h at $85/hr) | $3,825 |
| Labor — Stage 2 (17h at $85/hr) | $1,445 |
| Labor — Stage 3 (13-17h at $85/hr) | $1,105 - $1,445 |
| Tools and hosting | $0 (local only) |
| **Total estimated** | **$6,375 - $6,715** |

**Hours logged to date:** 31h ($2,635) as of 2026-06-04.

---

## Stakeholders

| Name | Role | Interest |
|---|---|---|
| Francisco De La Paz | Project Sponsor, Project Manager, Lead Developer, Technical Writer, QA Engineer, Deployment Engineer | Full ownership and sole user |
| Mad Tinker's Workshop | Primary environment and validation context | Operational efficiency across all active projects |
| 4Kings Enterprises | Parent organization | Internal tooling investment and documentation record |

---

## Risks (Summary)

| Risk | Level |
|---|---|
| registry.json drift — sessions skip end-of-session checklist | Medium |
| Schema violations from manual registry edits | Low |
| Triage and wiring views incomplete before Stage 2 closes | Resolved (2026-06-09) |
| WBS format deviations breaking TinkerScheduler parsing | Low |

---

## Authorization

Project authorized under 4Kings Enterprises internal operations budget.
Project Manager: Francisco De La Paz
Date: 2026-06-04
