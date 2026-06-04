# TinkerOps — Vision
**What this becomes at its ceiling**

---

## The Problem

Mad Tinker's Workshop has 40+ projects spanning Rust CLIs, Tauri desktop apps, Python tools, React dashboards, hardware builds, and pre-build concepts sitting across multiple drives. Tracking what is active, what is blocked, what needs documentation, and what needs triage was entirely manual — scattered across notes, memory, and chat history. There was no source of truth.

Every Claude Code session started with the same question: where did I leave off, and what needs attention?

---

## The Product

TinkerOps is the single pane of glass for the entire workshop. One dashboard, one registry, one place where every project's status, stack, documentation coverage, deployment targets, and blocking relationships are visible at a glance.

The registry.json file is the beating heart. Every Claude Code session reads and writes it. TinkerOps visualizes it. The two together form an always-current picture of the workshop without any manual bookkeeping.

---

## The Registry as Source of Truth

registry.json is not a config file. It is the authoritative record of every MTW project: status, stack, package manager, deployment targets, URLs, GitHub repo, documentation coverage, PMP document references, last worked date, last commit, blocking relationships, and session notes.

Every audit, documentation, and deploy agent reads and writes it. TinkerOps renders it. Nothing in the workshop is real until it has a registry record.

The schema is defined by PROJECT.schema.json. TypeScript types enforce it at build time. Claude Code enforces it at session time.

---

## The Governance Layer

TinkerOps grew beyond a dashboard. Five slash command agents form a governance system that runs inside every Claude Code session:

- /audit-project — scans a project, assesses doc coverage, flags anomalies, updates registry
- /new-project — scaffolds a new MTW project from scratch to MTW standard
- /doc-project — generates or catches up documentation including the full PMP suite
- /deploy-project — handles deployment for any MTW deployment target
- /session-close — end-of-session logging: hours, journal, registry sync, commit

These agents are not just tools. They are the enforcement mechanism that keeps the workshop organized across hundreds of sessions.

---

## Emergent Scope

TinkerOps started as a dashboard to see project status. It became a workshop operating system.

The Obsidian vault mirror emerged during the first documentation pass. Every project now has a parallel knowledge structure in the vault, including PMP documents, navigator notes, and a session journal. The vault and the registry are two views of the same truth.

The PMI experience documentation angle emerged from Francisco's PMP certification path. Every project with a PMP suite is a legitimate documented experience artifact. TinkerOps is the tool that makes that documentation sustainable at scale.

---

## At Its Ceiling

TinkerOps at full development:

- Surfaces actual hours from WBS logs and shows project time totals per role
- Generates pre-session briefings from registry state — what was last worked, what was blocked, what is next
- Flags dependency chain completions — "TinkerCode Phase 3 is done, TinkerGuard is now unblocked"
- Quick-edit mode for the notes field without leaving the dashboard
- Registry diff view showing what changed in the last session
- Doc coverage drift alerts for projects that had full coverage but have not been touched in 60 days

---

## Principles

- No backend. No auth. No cloud. This is a local operator tool.
- Registry as source of truth. The dashboard never lies because it reads reality directly.
- Reload reflects reality. Registry changes anywhere appear immediately on refresh.
- Agents enforce standard. Documentation quality is a system property, not a habit.
- Dark theme. MTW aesthetic. Built like the workshop it represents.
- Serves the operator, not the process.
