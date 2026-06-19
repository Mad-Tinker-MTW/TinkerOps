# TinkerOps — Status

## Current State
active

## Last Updated
2026-06-09

## What Works
- Registry loads from Data/registry.json on startup (53 projects, _meta in sync)
- Project cards with status badges, stack pills, doc coverage, and deployment icons
- Overview stats + name/tag/status/stack search
- Triage view for projects needing attention, with missing-field flags
- Wiring view — blocked-by dependency chains and division grouping (incl. Creative)
- Project detail panel with pipeline state, blocked-by/dependents, copy-able launch command
- Pipeline state read from Data/pipeline-state.json (PipelinePill + detail section)
- scripts/mtw_vcs.py worker: VCS-hygiene sweeps (scan/protect/snapshot/refresh)
- `bun run build` and `bun run dev` green on Linux and Windows

## What Needs Work
- Beyond-Stage-3 backlog only: PMP hours surface, session briefing, dependency-clear
  alerts on Overview, quick-edit mode, registry diff view, doc-drift alerts
- Wiring view is read-only; linear chains only, no graph layout

## Next Session
Stages 1-3 are complete. Pick from the Beyond-Stage-3 backlog in docs/ROADMAP.md —
session briefing and the registry diff view are the highest-value next steps.
