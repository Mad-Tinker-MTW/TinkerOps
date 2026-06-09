import { useSyncExternalStore } from 'react'

/**
 * Client-side persistence for the per-project UAT toggle.
 *
 * A project with `uat: true` in registry.json is treated as UAT coursework and
 * its toggle defaults to ON. Flipping the toggle OFF marks the project
 * "to be moved". TinkerOps has no backend and cannot write registry.json from
 * the browser, so that flip is stored in localStorage instead: registry.json
 * stays the source of truth for the default `uat` values, and this store only
 * tracks which UAT projects the operator has flipped off.
 *
 * The store is module-level so every ProjectCard and the Overview filter stay
 * in sync through a single subscription, with no context provider needed.
 */

const KEY = 'tinkerops_uat_moved'

function load(): Set<string> {
  try {
    const raw = localStorage.getItem(KEY)
    return new Set(raw ? (JSON.parse(raw) as string[]) : [])
  } catch {
    return new Set()
  }
}

// `moved` = ids of UAT projects flipped OFF (marked to be moved).
let moved: Set<string> = load()
const listeners = new Set<() => void>()

function persist() {
  try {
    localStorage.setItem(KEY, JSON.stringify([...moved]))
  } catch {
    // localStorage unavailable (private mode, etc.) — stay in-memory only.
  }
}

function emit() {
  listeners.forEach(l => l())
}

/** Flip a UAT project between "kept as UAT" (on) and "to be moved" (off). */
export function toggleMoved(id: string) {
  const next = new Set(moved)
  if (next.has(id)) next.delete(id)
  else next.add(id)
  moved = next // new reference so useSyncExternalStore re-renders
  persist()
  emit()
}

function subscribe(cb: () => void) {
  listeners.add(cb)
  return () => listeners.delete(cb)
}

function getSnapshot() {
  return moved
}

export interface UATMovedStore {
  /** True when this UAT project has been flipped off (marked to be moved). */
  isMoved: (id: string) => boolean
  /** Toggle a project's moved state. */
  toggle: (id: string) => void
  /** How many UAT projects are currently marked to be moved. */
  movedCount: number
}

export function useUATMoved(): UATMovedStore {
  const set = useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
  return {
    isMoved: (id: string) => set.has(id),
    toggle: toggleMoved,
    movedCount: set.size,
  }
}
