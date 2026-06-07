# TinkerOps — Status

## Current State
active

## Last Updated
2026-06-07

## What Works
- Registry loads from Data/registry.json on startup
- Project cards with status badges, stack pills, doc coverage, and deployment icons
- Overview stats (active, dormant, pre-build, triage counts) + project search/filter
- Triage view for projects needing attention
- Wiring view — blocked-by dependency chains and division grouping
- Project detail panel with pipeline state and copy-able launch command
- Pipeline state read from Data/pipeline-state.json (PipelinePill + detail section)
- `bun run build` and `bun run dev` both green on Linux and Windows

## What Needs Work
- Beyond-Stage-3 items only: PMP hours surface, session briefing, dependency-clear
  alerts surfaced on Overview, quick-edit mode, registry diff view, doc-drift alerts
- Wiring view is read-only; no graph layout beyond linear chains yet

## Next Session
Stages 1-3 are complete. Pick from the Beyond-Stage-3 backlog in docs/ROADMAP.md —
session briefing and the registry diff view are the highest-value next steps.
