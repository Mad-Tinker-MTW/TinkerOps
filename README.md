# TinkerOps

MTW Workshop Dev Console. A local React/Vite/TypeScript dashboard that reads `registry.json` as source of truth and displays all Mad Tinker's Workshop projects.

## Stack
- React + Vite + TypeScript + Tailwind
- Package manager: bun
- No backend, no auth — local tool only

## Setup

```
bun install
bun run dev
```

Runs on [localhost:5175](http://localhost:5175)

## Data

`Data/registry.json` is the source of truth for all MTW projects. `Data/PROJECT.schema.json` defines the record shape. The dashboard also reads `Data/pipeline-state.json` (written by the TinkerPipeline runner, shape defined by `Data/PIPELINE_STATE.schema.json`) to show per-project pipeline status. All are read at runtime, no build step required to update data.

## Status
Stages 1–3 complete. Overview (with search), Triage, and Wiring (blocked-by dependency chains + division grouping) views are all functional, alongside project cards, overview stats, and a detail panel with a copy-able launch command. Pipeline state view: a pipeline pill on each card and a pipeline section in the detail panel, fed by pipeline-state.json.
