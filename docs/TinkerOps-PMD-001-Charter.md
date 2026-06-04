# Project Charter — TinkerOps
**Project ID:** TinkerOps
**Document:** PMD-001
**Owner:** Francisco De La Paz (Mad Tinker), 4Kings Enterprises
**Date:** 2026-06-04
**Status:** Active

---

## Purpose

TinkerOps is the MTW Workshop Dev Console, a local React dashboard that reads registry.json as its single source of truth and gives the workshop operator a unified view of all active, dormant, triage, and pre-build projects. It replaces manual tracking in notes and removes the cognitive overhead of remembering what is active and what needs attention.

## Objectives

- Provide a single-pane dashboard for all MTW projects with real-time status, stack, doc coverage, and deployment info.
- Surface triage and blocked projects so nothing goes dark without notice.
- Support registry.json as the canonical project record across all MTW Claude Code sessions.
- Serve as the launch point for dev environment shortcuts and project navigation.

## Scope

**In scope:**
- React + Vite + TypeScript + Tailwind dashboard reading registry.json locally.
- Project cards, overview stats, triage view, project detail panel.
- Doc coverage indicators and deployment badges.
- Local-only operation, no backend, no auth, no external API calls.
- Dark-theme MTW aesthetic.

**Out of scope:**
- Authentication or multi-user access.
- Cloud sync or remote registry storage.
- Direct file system writes from the dashboard (registry updates are done in Claude Code sessions).
- Mobile or responsive layout (desktop-only internal tool).

## Success Criteria

- All 40+ MTW projects are visible with accurate status, stack, and doc coverage.
- Triage view surfaces all projects with `triage_needed: true`.
- Dashboard loads without error from a clean `bun install && bun run dev`.
- Registry changes in registry.json are reflected on page reload with no code changes.

## Constraints and Assumptions

- Must use bun as package manager. Never npm or pnpm.
- No backend. All data comes from the local Data/registry.json file at build/runtime.
- Runs only on the MTW workstation at localhost:5175.
- Registry schema is defined by PROJECT.schema.json and must not be violated.

## Stakeholders

Francisco De La Paz is the sole stakeholder, operator, and user of this tool. No external review, approval, or delivery is required.

## Timeline Estimate

Total estimated effort: 75-79 hours across three phases.
See PMD-002-WBS for phase breakdown.

| Phase | Description | Est. | Status |
|---|---|---|---|
| Phase 1 | Core Infrastructure | 45h | Complete |
| Phase 2 | Views and Components | 17h | Mostly complete |
| Phase 3 | Polish and Deployment | 13-17h | Pending |

**Actual hours logged to date:** 31h (2026-06-04)
