# TinkerOps — Bugs

## Open

None currently tracked.

## Resolved

| Date | Issue | Resolution |
|---|---|---|
| 2026-06-04 | CLAUDE.md had stale data source path (`src/data/registry.json`) | Corrected to `Data/registry.json` |
| 2026-06-04 | registry.json had `package_manager: "pnpm"` and `launch_cmd: "pnpm dev"` | Corrected to bun |
| 2026-06-04 | node_modules installed via pnpm | Resolved with `bun install` |
