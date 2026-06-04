# TinkerOps — Technical Specification

## Runtime

- Framework: React 18 + Vite 5 + TypeScript 5
- Styling: Tailwind CSS 3
- Package manager: bun
- Port: 5175
- Entry point: index.html -> src/main.tsx -> src/App.tsx

## Data Model

Registry source: `Q:\MTW\TinkerOps\Data\registry.json`
Schema: `Q:\MTW\TinkerOps\Data\PROJECT.schema.json`

Each project record contains: id, name, status, division, path, alt_path, stack, package_manager, deployment, urls, github, docs, pmp_ids, launch, launch_cmd, port, last_worked, last_commit, summary, tags, blocked_by, triage_needed, notes.

Status values: active, dormant, pre-build, placeholder, complete, archived, triage.

## Components

- `StatCards` — overview counts derived from registry (active, dormant, pre-build, triage)
- `ProjectCard` — per-project card with status badge, stack pills, doc coverage, deployment icons
- `StatusBadge` — color-coded status indicator
- `DocCoverage` — visual indicator for readme, claude_md, status_md, pmp flags
- `StackPill` — stack technology tag
- `DeploymentIcons` — deployment target icon set
- `ProjectDetail` — full record display panel

## Views

- Overview — all projects as cards with stat summary
- Triage — filtered view of projects with triage_needed: true
- Wiring — division grouping and blocked-by dependency chain

## Constraints

- No external API calls
- No auth layer
- No backend
- No writes — dashboard is read-only, registry updates happen in Claude Code sessions
