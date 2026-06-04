# TinkerOps — Claude Code Context

## What This Is
TinkerOps is the MTW Workshop Dev Console. A local React/Vite/TypeScript dashboard that reads registry.json as source of truth and displays all Mad Tinker's Workshop projects.

## Stack
- React + Vite + TypeScript + Tailwind
- Package manager: bun (never npm, never npx, use bunx)
- No backend, no auth, local tool only
- Data source: Data/registry.json (project root, read at runtime)

## Launch
```
bun run dev
```
Runs on localhost:5175

## Data
registry.json is the source of truth for all MTW projects.
PROJECT.schema.json defines the shape of each record.
Both live in Q:\MTW\TinkerOps\data\

When adding or updating project records always validate against the schema.

## Key Rules
- Never use npm, npx, or pnpm — always bun and bunx
- No external API calls
- No auth layer
- Dark theme, MTW aesthetic
- Read registry.json on load, no backend needed

## Project Status
Built June 2026. Initial build complete. Wiring and triage views may need completion.
