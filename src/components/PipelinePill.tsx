import type { PipelineState } from '../types/registry'

const PHASE_LABEL: Record<string, string> = {
  idle: 'IDLE',
  plan: 'PLAN',
  execute: 'EXEC',
  'awaiting-audit': 'AUDIT?',
  audit: 'AUDIT',
}

const STATUS_STYLE: Record<string, { className: string; glyph: string; pulse: boolean }> = {
  running: { className: 'bg-amber-500/15 text-amber-400 border-amber-500/30', glyph: '⟳', pulse: true },
  ok:      { className: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30', glyph: '▸', pulse: false },
  failed:  { className: 'bg-red-500/15 text-red-400 border-red-500/30', glyph: '✕', pulse: false },
}

interface Props {
  state: PipelineState
  size?: 'sm' | 'md'
}

export function PipelinePill({ state, size = 'sm' }: Props) {
  const style = STATUS_STYLE[state.status] ?? STATUS_STYLE.ok
  const label = PHASE_LABEL[state.phase] ?? state.phase.toUpperCase()
  const sizeClass = size === 'md' ? 'px-2 py-0.5 text-[10px]' : 'px-1.5 py-0.5 text-[9px]'

  const counts =
    state.tasks_total != null
      ? ` · ${state.tasks_complete ?? 0}/${state.tasks_total}`
      : ''
  const title =
    `pipeline: ${state.phase} / ${state.status}` +
    (state.last_run ? ` · ${state.last_run}` : '') +
    (state.last_task ? ` · last ${state.last_task}` : '')

  return (
    <span
      title={title}
      className={`inline-flex items-center gap-1 rounded font-mono font-semibold tracking-wider border ${sizeClass} ${style.className}`}
    >
      <span className={style.pulse ? 'animate-pulse' : ''}>{style.glyph}</span>
      {label}
      {counts && <span className="opacity-70">{counts}</span>}
    </span>
  )
}
