# Risk Register — TinkerOps
**Project ID:** TinkerOps
**Document:** PMD-005
**Owner:** Francisco De La Paz (Mad Tinker)
**Date:** 2026-06-04

---

## Active Risks

| ID | Risk | Probability | Impact | Mitigation |
|---|---|---|---|---|
| R-01 | registry.json drift — Claude Code sessions update the file but not all sessions follow the end-of-session checklist | Medium | High | CLAUDE.md checklist enforces updates; /audit-project agent catches drift |
| R-02 | Schema violations — a manually edited registry record breaks the schema | Low | Medium | PROJECT.schema.json validates shape; TypeScript types catch mismatches at build time |
| R-03 | Triage view incomplete — projects with triage_needed: true may not surface correctly if view has bugs | Low | Medium | Test triage view during Phase 2 completion pass |
| R-04 | pnpm/bun conflict — future contributors may install with wrong package manager | Low | Low | CLAUDE.md and package.json both enforce bun; node_modules now clean |

## Resolved Risks

| ID | Risk | Resolution | Date |
|---|---|---|---|
| R-05 | node_modules installed via pnpm, not bun | Resolved with `bun install` | 2026-06-04 |
| R-06 | No git history — project had no version control | git init, initial commit, pushed to GitHub | 2026-06-04 |
