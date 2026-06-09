import { useUATMoved } from '../hooks/useUATFlags'

interface Props {
  id: string
}

/**
 * Per-project UAT toggle. Default state is ON (teal "UAT") for any project with
 * `uat: true`. Flipping it OFF marks the project "to be moved" (red badge) and
 * persists that choice client-side via useUATMoved. Stops click propagation so
 * toggling never opens the card detail.
 */
export function UATToggle({ id }: Props) {
  const { isMoved, toggle } = useUATMoved()
  const moved = isMoved(id)

  return (
    <button
      type="button"
      onClick={e => {
        e.stopPropagation()
        toggle(id)
      }}
      title={
        moved
          ? 'Marked to be moved — click to keep as UAT coursework'
          : 'UAT coursework (on) — click to mark it to be moved'
      }
      aria-pressed={!moved}
      className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-mono font-medium border transition-colors ${
        moved
          ? 'bg-red-500/15 text-red-400 border-red-500/30 hover:border-red-500/60'
          : 'bg-teal-500/15 text-teal-300 border-teal-500/30 hover:border-teal-500/60'
      }`}
    >
      {moved ? '⇄ to move' : 'UAT ✓'}
    </button>
  )
}
