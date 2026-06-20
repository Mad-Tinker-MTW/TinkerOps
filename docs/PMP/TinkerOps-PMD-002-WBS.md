# Work Breakdown Structure — TinkerOps
**Project ID:** TinkerOps
**Document:** PMD-002
**Owner:** Francisco De La Paz (Mad Tinker)
**Version:** 1.1
**Date:** 2026-06-04

---

#### 1.1 Stage 1: Core Infrastructure
**Status: Complete | Estimated: 45h**

| ID | Task | Status |
|---|---|---|
| 1.0 | Project Planning and Architecture | Complete |
| 1.1 | Project Scaffolding | Complete |
| 1.2 | Registry Schema Design | Complete |
| 1.2a | Registry Data Population | Complete |
| 1.3 | TypeScript Types | Complete |
| 1.4 | Data Load | Complete |
| 1.5 | App Shell | Complete |
| 1.6 | Overview Stats | Complete |
| 1.7 | Project Card | Complete |
| 1.8 | Agent Design and Documentation | Complete |
| 1.9 | Infrastructure Setup | Complete |
| 1.10 | Iteration and Refinement | Complete |

---

#### 1.2 Stage 2: Views and Components
**Status: Complete | Estimated: 17h**

| ID | Task | Status |
|---|---|---|
| 2.1 | StatusBadge Component | Complete |
| 2.2 | DocCoverage Component | Complete |
| 2.3 | StackPill + DeploymentIcons | Complete |
| 2.4 | Project Detail Panel | Complete |
| 2.5 | Triage View | Complete |
| 2.6 | Wiring View | Complete |

---

#### 1.3 Stage 3: Polish and Deployment
**Status: Complete | Estimated: 13-17h**

| ID | Task | Status |
|---|---|---|
| 3.1 | Bun Rebase | Complete |
| 3.2 | Git Initialization | Complete |
| 3.3 | Search and Filter | Complete |
| 3.4 | Wiring View Completion | Complete |
| 3.5 | Launch Shortcuts | Complete |
| 3.6 | Documentation | Complete |

---

#### 1.4 Stage 4: Server-Mode Features
**Status: Complete | Estimated: 13h**

| ID | Task | Status |
|---|---|---|
| 4.1 | esp32-firmware deployment-target crash fix + unknown-target fallback | Complete |
| 4.2 | Folder launcher (Launch TinkerOps.bat) + Windows logon autostart task | Complete |
| 4.3 | In-app Logs feature: /api/logs + /api/logfile endpoints, LogViewer panel, master LOG | Complete |
| 4.4 | Live URL + reachability status dots on cards (/api/health probe) | Complete |
| 4.5 | Editable per-section card ordering (/api/order, Data/ui-order.json) | Complete |
| 4.6 | Registry notes consolidation to a single newest-note + master LOG history | Complete |
| 4.7 | Per-card clean button: /api/clean endpoint + clean_cmd registry field | Complete |
| 4.8 | On-card release tag (release field) + Ares stamp + mythology codename convention | Complete |

---

## Total Estimated Effort
**88-92 hours**

Stage 1: 45h (complete)
Stage 2: 17h (complete)
Stage 3: 13-17h (complete)
Stage 4: 13h (complete) — server-mode features added post-v1, beyond the original 75-79h build estimate

---

## Actual Hours Log

### Session 1 — 2026-06-04

| ID | Task | Role | Hours |
|---|---|---|---|
| 1.0 | Project Planning and Architecture | Lead Developer | 8h |
| 1.2 | Registry Schema Design | Lead Developer | 4h |
| 1.2a | Registry Data Population | Lead Developer | 6h |
| 1.8 | Agent Design and Documentation | Lead Developer | 8h |
| 1.9 | Infrastructure Setup | Lead Developer | 2h |
| 1.10 | Iteration and Refinement | Lead Developer | 3h |

**Session 1 Total: 31h**

### Session 2 — 2026-06-04

| ID | Task | Role | Hours |
|---|---|---|---|
| 1.0 | Project Planning and Architecture | Project Manager | 2h |
| 1.0 | Project Planning and Architecture | Solutions Architect | 2h |
| 1.8 | Agent Design and Documentation | Technical Writer | 3h |
| 1.10 | Iteration and Refinement | Lead Developer | 1h |
| 3.6 | Documentation — standards pass (VISION, ROADMAP, SPEC, BUGS, CHANGELOG) | Technical Writer | 4h |
| 3.6 | Documentation — PMD-001 Charter full rewrite | Project Manager | 2h |
| 3.6 | Documentation — Obsidian navigator and charter sync | Technical Writer | 0.5h |
| — | Audit and Standards QA (4 audit runs, compliance review) | QA Engineer | 2h |
| — | Project Audit and Registry (gap analysis, registry updates) | Project Manager | 1h |
| — | Docs Layout Fix and WBS Reformat | Lead Developer | 1h |
| — | GitHub Push and Deployment | Deployment Engineer | 0.5h |

**Session 2 Total: 19h**

---

### Session 3 — 2026-06-04

| ID | Task | Role | Hours |
|---|---|---|---|
| — | Audit verification pass (coverage check, gap analysis) | QA Engineer | 0.5h |
| — | Audit verification pass (coordination, report) | Project Manager | 0.5h |
| 3.6 | Obsidian mirror sync (SPEC, ROADMAP, BUGS, VISION) | Technical Writer | 1.5h |
| 3.6 | Frontmatter and source: field updates | Technical Writer | 0.5h |
| — | docs\PMP\ structure decision and planning | Project Manager | 0.5h |
| — | Git commit and push | Deployment Engineer | 0.5h |

**Session 3 Total: 4h**

---

### Session 4 — 2026-06-14 (skill ecosystem migration + working-style memory framework)

| ID | Task | Role | Hours |
|---|---|---|---|
| 1.8 | Agent Design: skill anatomy and migration architecture | Solutions Architect | 1.5h |
| 1.8 | Agent Design: 10 SKILL.md authoring | Lead Developer | 1.5h |
| 3.6 | Documentation: trigger-phrase frontmatter authoring | Technical Writer | 0.5h |
| 1.8 | Agent Design: working-style memory framework architecture | Solutions Architect | 1.0h |
| 3.6 | Documentation: memory file authoring and MEMORY.md index | Technical Writer | 0.5h |

**Session 4 Total: 5h** (recovered 2026-06-20: this block, documented in workspace-session-2026-06-14.md, was displaced when the 2026-06-20 checkpoint reused the "Session 4" label)

---

### Session 5 — 2026-06-20 (workspace infra + ecosystem architecture)

| ID | Task | Role | Hours |
|---|---|---|---|
| — | Frozen-session recovery + continuity troubleshooting (transcript archaeology, cross-session tooling, proving work safe) | QA Engineer | 1.5h |
| — | Cross-project investigation + day-search reconcile (~9 projects, drift found, 2 tools registered) | Project Manager | 1.5h |
| — | Ecosystem + concept architecture decisions (Board/Bench/Brain, cockpit, hub service, branch engine, continuity) | Solutions Architect | 3.0h |
| — | Problem diagnosis (capture pipeline root cause, skills/permissions scope, handoff-sprawl audit) | QA Engineer | 1.0h |
| — | Skills + permissions global migration (diagnose, execute, verify) | Lead Developer | 1.0h |

**Session 5 Total: 8h**

---

### Session 6 — 2026-06-20 (ecosystem documentation pass)

| ID | Task | Role | Hours |
|---|---|---|---|
| — | MTW-ECOSYSTEM.md north-star design doc (spine, two ecosystems, backbone, 5 component specs, sequence, vocab) | Technical Writer | 1.5h |
| — | Ecosystem architecture consolidation into doc form | Solutions Architect | 1.0h |
| — | OPEN-LOOPS.md ledger: format design and seeding with the session's open threads | Project Manager | 0.5h |
| — | OPEN-LOOPS.md ledger authoring | Technical Writer | 0.5h |
| — | TinkerBench cockpit concept rewrite (CONCEPT-COCKPIT.md + STATUS + registry note) | Technical Writer | 1.0h |
| — | TinkerBench cockpit re-architecture (compare-app to service plus thin-clients) | Solutions Architect | 0.5h |

**Session 6 Total: 5h**

---

### Session 7 — 2026-06-20 (server-mode features: launchers, logs, health, ordering)

| ID | Task | Role | Hours |
|---|---|---|---|
| 4.1 | esp32-firmware crash fix across DeploymentIcons, type, schema | Lead Developer | 0.5h |
| 4.1 | Root-cause and verification of the crash | QA Engineer | 0.5h |
| 4.2 | Folder launcher and logon autostart implementation | Lead Developer | 1.0h |
| 4.2 | Autostart task wiring and idempotent boot design | Deployment Engineer | 0.5h |
| 4.3 | Logs feature design: endpoints, viewer, log model | Solutions Architect | 1.0h |
| 4.3 | Logs feature implementation: endpoints, LogViewer, detail section, CSS | Lead Developer | 2.0h |
| 4.3 | Master LOG.md authoring | Technical Writer | 0.5h |
| 4.3 | In-browser verification of logs viewer | QA Engineer | 0.5h |
| 4.4 | Live URL and health-dot: /api/health probe, useHealth hook, card UI | Lead Developer | 1.5h |
| 4.4 | Reachability up/down verification | QA Engineer | 0.5h |
| 4.5 | Card ordering design: order model and persistence | Solutions Architect | 0.5h |
| 4.5 | Card ordering: useOrder hook, /api/order, badge UI, reorder logic | Lead Developer | 1.5h |
| 4.5 | Reorder and persistence round-trip verification | QA Engineer | 0.5h |
| 4.6 | Surgical registry notes trim with validation | Lead Developer | 0.5h |
| 4.6 | Master LOG structure and history migration | Technical Writer | 0.5h |
| — | /audit-project pass and consistency checks | QA Engineer | 1.0h |
| — | L-013 reconcile decision and WBS restructure | Project Manager | 0.5h |

**Session 7 Total: 13h**

---

### Session 8 — 2026-06-20 (per-card clean button)

| ID | Task | Role | Hours |
|---|---|---|---|
| 4.7 | Clean button: /api/clean endpoint, clean_cmd field, card UI, arm-then-run safety | Lead Developer | 1.0h |
| 4.7 | Schema, SPEC, CHANGELOG updates and in-browser verification | Technical Writer | 0.5h |

**Session 8 Total: 1.5h**

---

### Session 9 — 2026-06-20 (release indicator + Ares stamp)

| ID | Task | Role | Hours |
|---|---|---|---|
| 4.8 | On-card release tag: release registry field + schema + type + card UI | Lead Developer | 1.0h |
| 4.8 | Ares release stamping across STATUS, CHANGELOG, WBS; mythology codename convention | Technical Writer | 0.5h |

**Session 9 Total: 1.5h**

---

**Running Total: 88h of 88-92h estimated**

## Release

**Ares (v1.1.0)** — feature-complete 2026-06-20. TinkerOps is shipped as the Ares release. It stays in the Active list intentionally (the release tag on the card is the done indicator, not a registry status change). All four stages done; sessions 1-8 sum to 86.5h. Optional enhancements remain parked in ROADMAP.md "Beyond Stage 4" for a future revisit, but nothing is outstanding.

Resolved 2026-06-20 (/audit-project, L-013): the 2026-06-14 skill-migration work block (5.0h) was recovered and inserted as Session 4 above. It had been displaced when the 2026-06-20 checkpoint reused the "Session 4" label for different work; the 06-20 blocks are now Sessions 5 and 6. Sessions 1-7 sum to 85h (31 + 19 + 4 + 5 + 8 + 5 + 13).
