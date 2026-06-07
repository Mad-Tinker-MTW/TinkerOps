# TinkerOps — Changelog

---

## [1.0.6] — 2026-06-07

### Added

- Wiring view (Stage 2.6): a third nav tab visualizing the project graph. Renders blocked-by dependency chains in build order (root blocker → leaf) and groups every project by division, with an Unassigned group for division-less projects. Cards and chain nodes open the detail panel.
- Dependency-clear hint: a chain flags when an upstream blocker has reached `complete`, signaling downstream work may now be unblocked.
- Copy-to-clipboard button on the launch command in the project detail panel (Stage 3 launch shortcut).

### Fixed

- Cross-platform build break: registry/pipeline imports referenced `../data/` while the directory is `Data/`. Resolved only on case-insensitive filesystems (Windows); `bun run build` and CI on Linux failed with TS2307. Imports now match the actual `Data/` case.

### Notes

- The Wiring view was listed in the 1.0.0 changelog but never actually existed; this entry makes the code match the record.

---

## [1.0.5] — 2026-06-05

### Changed

- Doc reconciliation: brought README, SPEC, and Charter in line with the v1.0.4 pipeline state feature, which had only been recorded in the CHANGELOG
- SPEC: added pipeline-state.json as a data source, a Pipeline State data-model subsection, the PipelinePill component, and pipeline notes on ProjectCard and ProjectDetail; version to 1.0.4; noted the additional TinkerPipeline agents at the shared commands path
- README: Data and Status sections note the pipeline state view and pipeline-state.json
- Charter: pipeline state view added to In Scope and Deliverables

---

## [1.0.4] — 2026-06-05

### Added

- Pipeline state view: the dashboard now reads data/pipeline-state.json (written by the TinkerPipeline runner) and surfaces it per project
- PipelinePill component on each ProjectCard showing phase, status, and task counts, color-coded with a pulse while running
- Pipeline section in the project detail panel (tasks, last task, last commit, plan file, last run)
- Types: PipelinePhase, PipelineStatus, PipelineState, PipelineStateMap
- PIPELINE_STATE.schema.json in data/ defining the state file shape

### Infrastructure

- pipeline-state.json committed and read via static import alongside registry.json; the runner never writes registry.json

---

## [1.0.3] — 2026-06-04

### Changed

- Moved all PMD files from flat docs\ into docs\PMP\ subfolder per MTW standard
- Synced 4 stale Obsidian mirrors to current versions: SPEC, ROADMAP, BUGS, VISION
- Added source: frontmatter field to all Obsidian doc copies (CHANGELOG, SPEC, ROADMAP, BUGS, VISION, PMD-001 through PMD-006)
- Updated Obsidian PMD-001 and PMD-003 source: paths to reflect docs\PMP\ location

### Infrastructure

- Session 3 hours logged: 4h across Technical Writer, QA Engineer, Project Manager, Deployment Engineer
- Running total: 54h of 75-79h estimated
- Deleted TinkerOps.md legacy project card from Obsidian vault

---

## [1.0.2] — 2026-06-04

### Changed

- Merged PMD-002-WBS and PMD-003-WBS into a single authoritative PMD-002-WBS with TinkerScheduler-parseable stage headers, estimated hours per stage, and full role-separated Actual Hours Log
- PMD-003-WBS deleted from project docs\ and Obsidian vault PMP\; Obsidian PMD-003 slot updated to mirror new merged WBS

### Infrastructure

- Session 2 hours logged: 19h across Project Manager, Solutions Architect, Technical Writer, Lead Developer, QA Engineer, and Deployment Engineer roles
- Running total: 50h of 75-79h estimated
- WBS 3.6 Documentation marked Complete

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
