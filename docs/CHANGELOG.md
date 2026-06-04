# TinkerOps — Changelog

---

## [1.0.1] — 2026-06-04

### Documentation pass

- README.md, STATUS.md, SPEC.md, VISION.md, ROADMAP.md, BUGS.md, CHANGELOG.md written
- CLAUDE.md data path corrected from `src/data/registry.json` to `Data/registry.json`
- PMP Charter (PMD-001) and WBS (PMD-002) written, 75-79h total estimate
- WBS updated: added tasks 1.0, split 1.2/1.2a, added 1.8 through 1.10, actual hours log
- Obsidian vault project folder created with full doc structure and PMP subfolder (6 docs)
- registry.json: package_manager, launch_cmd, docs flags, and pmp_ids corrected

### Infrastructure

- bun install run — node_modules rebased from pnpm to bun
- git initialized and pushed to Mad-Tinker-MTW/TinkerOps

### Docs layout and format fixes

- Moved BUGS, CHANGELOG, ROADMAP, SPEC, VISION from project root into docs\
- Added PMD-003 through PMD-006 (WBS mirror, Schedule, Risk Register, Stakeholder Register)
- Reformatted PMD-002 WBS to TinkerScheduler-parseable format (#### stage headers, ID/Task/Status columns)
- All docs brought to MTW standard format (SPEC, VISION, ROADMAP, BUGS, CHANGELOG, Charter)
- Obsidian navigator README upgraded to rich navigator format

---

## [1.0.0] — 2026-06-03

### Initial build

- React + Vite + TypeScript + Tailwind scaffolding
- registry.json schema designed (PROJECT.schema.json) and populated with 38 project records
- StatCards, ProjectCard, StatusBadge, DocCoverage, StackPill, DeploymentIcons components built
- ProjectDetail panel
- Overview, Triage, and Wiring views
- Four Claude Code slash command agents: audit-project, new-project, doc-project, deploy-project
- Global CLAUDE.md and TinkerOps CLAUDE.md
- start.ps1 launcher
