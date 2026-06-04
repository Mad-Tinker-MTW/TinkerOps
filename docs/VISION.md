# TinkerOps — Vision

## The Problem

Mad Tinker's Workshop has 40+ projects spanning Rust CLIs, Tauri desktop apps, Python tools, React dashboards, hardware projects, and pre-build concepts. Tracking what is active, what is blocked, what needs documentation, and what needs triage was entirely manual — scattered across notes, memory, and chat history.

## The Vision

TinkerOps is the single pane of glass for the entire workshop. One dashboard that answers:

- What is currently active and what is blocked?
- Which projects are missing documentation?
- What needs triage?
- How do I launch any project from one place?

The registry.json file is the beating heart. Every Claude Code session reads and writes it. TinkerOps visualizes it. The two together form an always-current picture of the workshop without any manual bookkeeping.

## Design Principles

No backend. No auth. No cloud dependency. This is a local operator tool, not a product. It should load instantly, reflect reality on reload, and never get in the way.

Dark theme. MTW aesthetic. Built like the workshop it represents.

## Long-Term Direction

Phase 3 adds search, launch shortcuts, and wiring view completion. Beyond that, TinkerOps could evolve to surface time tracking from PMP logs, flag dependency chains that are blocking progress, and generate session briefings before a work session begins.
