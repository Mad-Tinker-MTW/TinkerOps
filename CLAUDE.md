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

## Launch Endpoint (the one backend exception)
The "no backend" rule has a single deliberate exception: a dev-server-only launch
middleware in vite.config.ts (`POST /api/launch`). It exists so the card "$ run"
button can actually start a desktop/CLI project. It accepts only a project `id`,
looks the project up in data/registry.json, and spawns that project's OWN
`launch_cmd` at its `path` in a new console. It never runs a client-supplied
command string. It runs only under `bun run dev` (configureServer), not in build or
preview. Because it spawns local processes, the dev server must stay bound to
localhost: never set server.host to 0.0.0.0 while this is enabled.

## Project Status
Built June 2026. Initial build complete. Wiring and triage views may need completion.
