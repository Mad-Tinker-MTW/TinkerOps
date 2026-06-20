import { useSyncExternalStore } from 'react'

/**
 * Manual per-section card ordering for the Overview board, persisted server-side
 * in Data/ui-order.json via the dev-server /api/order endpoint (so the order is
 * the same from any device hitting this server, not per-browser).
 *
 * `ranks` maps projectId -> a 1-based rank WITHIN its status section. Sections
 * are disjoint, so a single flat map is unambiguous. Unranked projects sort
 * after ranked ones, alphabetically — so before any manual ordering the board
 * looks exactly as it did (pure alphabetical). Reordering a section rewrites
 * sequential ranks for just that section's members.
 *
 * Module-level store with one subscription, mirroring useUATFlags.
 */

let ranks: Record<string, number> = {}
let loaded = false
const listeners = new Set<() => void>()

function emit() {
  listeners.forEach(l => l())
}

function loadOnce() {
  if (loaded) return
  loaded = true
  fetch('/api/order')
    .then(r => r.json())
    .then(j => {
      if (j.ok && j.order && typeof j.order === 'object') {
        ranks = j.order
        emit()
      }
    })
    .catch(() => {
      /* endpoint unavailable — stay with empty (alphabetical) order */
    })
}

function persist() {
  fetch('/api/order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ order: ranks }),
  }).catch(() => {
    /* best-effort; in-memory order still applies for this load */
  })
}

/**
 * Move `id` to a 1-based `newPos` within its section. `orderedSectionIds` is the
 * section's current on-screen order. Everything at/after the target shifts down.
 */
export function reorderWithin(orderedSectionIds: string[], id: string, newPos: number) {
  const without = orderedSectionIds.filter(x => x !== id)
  const idx = Math.max(0, Math.min(without.length, Math.round(newPos) - 1))
  without.splice(idx, 0, id)

  const next = { ...ranks }
  without.forEach((pid, i) => {
    next[pid] = i + 1
  })
  ranks = next
  persist()
  emit()
}

function subscribe(cb: () => void) {
  loadOnce()
  listeners.add(cb)
  return () => listeners.delete(cb)
}

function getSnapshot() {
  return ranks
}

export interface OrderStore {
  /** Rank of a project within its section; Infinity if not yet ordered. */
  getRank: (id: string) => number
  /** Reorder a project within its section to a 1-based position. */
  reorder: (orderedSectionIds: string[], id: string, newPos: number) => void
}

export function useOrder(): OrderStore {
  const map = useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
  return {
    getRank: (id: string) => (id in map ? map[id] : Infinity),
    reorder: reorderWithin,
  }
}
