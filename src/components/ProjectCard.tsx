import { useState } from 'react'
import type { Project, PipelineState } from '../types/registry'
import type { Health } from '../hooks/useHealth'
import { StatusBadge } from './StatusBadge'
import { DocCoverage } from './DocCoverage'
import { DeploymentIcons } from './DeploymentIcons'
import { StackPill } from './StackPill'
import { PipelinePill } from './PipelinePill'
import { UATToggle } from './UATToggle'
import { useUATMoved } from '../hooks/useUATFlags'

const MAX_STACK_PILLS = 5

interface Props {
  project: Project
  pipeline?: PipelineState
  onClick: (p: Project) => void
  highlight?: boolean
  /** 1-based position within its status section (Overview board). */
  position?: number
  /** Number of cards in this section, for clamping edits. */
  sectionSize?: number
  /** Live reachability of the project's local URL, if it has one. */
  health?: Health
  /** Commit a new 1-based position; omitted = not editable (e.g. while searching). */
  onReorder?: (newPos: number) => void
}

function prettyUrl(url: string): string {
  return url.replace(/^https?:\/\//, '').replace(/\/$/, '')
}

// Editable order number shown top-left of each card. Click (when editable) to
// type a new position; everything shifts to accommodate.
function OrderBadge({
  position,
  sectionSize,
  onReorder,
}: {
  position: number
  sectionSize?: number
  onReorder?: (newPos: number) => void
}) {
  const [editing, setEditing] = useState(false)
  const [val, setVal] = useState(String(position))

  const commit = () => {
    setEditing(false)
    const n = parseInt(val, 10)
    if (!Number.isNaN(n) && n !== position) onReorder?.(n)
    else setVal(String(position))
  }

  if (editing) {
    return (
      <input
        autoFocus
        type="number"
        min={1}
        max={sectionSize}
        value={val}
        onClick={e => e.stopPropagation()}
        onChange={e => setVal(e.target.value)}
        onBlur={commit}
        onKeyDown={e => {
          e.stopPropagation()
          if (e.key === 'Enter') commit()
          if (e.key === 'Escape') {
            setVal(String(position))
            setEditing(false)
          }
        }}
        className="w-9 shrink-0 bg-surface-900 border border-amber-500/50 rounded text-[10px] font-mono text-amber-300 px-1 py-0.5 text-center focus:outline-none"
      />
    )
  }

  return (
    <button
      onClick={e => {
        e.stopPropagation()
        if (!onReorder) return
        setVal(String(position))
        setEditing(true)
      }}
      title={onReorder ? 'Click to set position' : undefined}
      className={`shrink-0 w-6 h-6 flex items-center justify-center rounded text-[10px] font-mono border ${
        onReorder
          ? 'bg-surface-600 text-gray-400 border-gray-700/60 hover:border-amber-500/50 hover:text-amber-300 cursor-text'
          : 'bg-surface-700 text-gray-600 border-gray-800/60'
      }`}
    >
      {position}
    </button>
  )
}

function HealthDot({ health }: { health: Health }) {
  const cfg =
    health === 'up'
      ? { color: 'bg-green-400', ring: 'shadow-[0_0_6px_rgba(74,222,128,0.7)]', label: 'running' }
      : health === 'down'
        ? { color: 'bg-red-400', ring: '', label: 'offline' }
        : { color: 'bg-gray-600 animate-pulse', ring: '', label: 'checking…' }
  return <span title={cfg.label} className={`w-1.5 h-1.5 rounded-full ${cfg.color} ${cfg.ring}`} />
}

export function ProjectCard({
  project,
  pipeline,
  onClick,
  highlight = false,
  position,
  sectionSize,
  health,
  onReorder,
}: Props) {
  const {
    name,
    status,
    stack,
    deployment,
    docs,
    launch_cmd,
    clean_cmd,
    urls,
    last_worked,
    summary,
    blocked_by,
    triage_needed,
  } = project

  const visibleStack = stack.slice(0, MAX_STACK_PILLS)
  const extraStack = stack.length - MAX_STACK_PILLS

  const localUrl = urls.local
  const prodUrl = urls.production

  const [launchState, setLaunchState] = useState<'idle' | 'launching' | 'ok' | 'err'>('idle')

  async function handleRun(e: React.MouseEvent) {
    e.stopPropagation()
    if (localUrl) return void window.open(localUrl, '_blank')
    if (prodUrl) return void window.open(prodUrl, '_blank')
    if (!launch_cmd) return
    setLaunchState('launching')
    try {
      const r = await fetch('/api/launch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: project.id }),
      })
      const j = await r.json()
      setLaunchState(j.ok ? 'ok' : 'err')
    } catch {
      setLaunchState('err')
    }
    setTimeout(() => setLaunchState('idle'), 2500)
  }

  const runLabel =
    launchState === 'launching'
      ? '· running…'
      : launchState === 'ok'
        ? '✓ launched'
        : launchState === 'err'
          ? '✗ failed'
          : localUrl || prodUrl
            ? '↗ launch'
            : '$ run'

  // Clean button: arms on first click (delete safety), runs on second.
  const [cleanState, setCleanState] = useState<'idle' | 'armed' | 'cleaning' | 'done' | 'err'>('idle')
  const [freed, setFreed] = useState<string | null>(null)

  async function handleClean(e: React.MouseEvent) {
    e.stopPropagation()
    if (!clean_cmd) return
    if (cleanState === 'idle') {
      setCleanState('armed')
      setTimeout(() => setCleanState(s => (s === 'armed' ? 'idle' : s)), 3000)
      return
    }
    if (cleanState !== 'armed') return
    setCleanState('cleaning')
    try {
      const r = await fetch('/api/clean', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: project.id }),
      })
      const j = await r.json()
      if (j.ok) {
        setFreed(j.freed ?? null)
        setCleanState('done')
      } else {
        setCleanState('err')
      }
    } catch {
      setCleanState('err')
    }
    setTimeout(() => setCleanState('idle'), 3000)
  }

  const cleanLabel =
    cleanState === 'armed'
      ? 'clean? '
      : cleanState === 'cleaning'
        ? '· cleaning…'
        : cleanState === 'done'
          ? freed
            ? `✓ ${freed}`
            : '✓ clean'
          : cleanState === 'err'
            ? '✗ failed'
            : '🧹 clean'

  const { isMoved } = useUATMoved()
  const isUat = project.uat === true
  const moved = isUat && isMoved(project.id)

  const borderColor = moved
    ? 'border-red-500/40'
    : highlight
    ? 'border-amber-500/40'
    : status === 'active'
    ? 'border-green-500/20'
    : status === 'triage'
    ? 'border-amber-500/20'
    : 'border-gray-700/40'

  return (
    <div
      onClick={() => onClick(project)}
      className={`
        group relative bg-surface-700 border ${borderColor} rounded-lg p-4 cursor-pointer
        hover:border-gray-500/60 hover:bg-surface-600 transition-all duration-150
        ${highlight ? 'ring-1 ring-amber-500/20' : ''}
      `}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        {position != null && (
          <OrderBadge position={position} sectionSize={sectionSize} onReorder={onReorder} />
        )}
        <div className="flex-1 min-w-0">
          <h3 className="font-mono font-semibold text-sm text-white truncate leading-tight">
            {name}
          </h3>
          {blocked_by && (
            <p className="text-[10px] font-mono text-amber-400/70 mt-0.5">
              blocked by {blocked_by}
            </p>
          )}
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <StatusBadge status={status} />
          {pipeline && <PipelinePill state={pipeline} />}
          {isUat && <UATToggle id={project.id} />}
        </div>
      </div>

      {/* Summary */}
      <p className="text-[11px] text-gray-500 leading-relaxed line-clamp-2 mb-3">
        {summary}
      </p>

      {/* Stack pills */}
      {stack.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {visibleStack.map(t => <StackPill key={t} tech={t} />)}
          {extraStack > 0 && (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-mono text-gray-600">
              +{extraStack}
            </span>
          )}
        </div>
      )}

      {/* Live URL + status */}
      {localUrl && (
        <div className="flex items-center gap-1.5 mb-2 min-w-0">
          {health && <HealthDot health={health} />}
          <a
            href={localUrl}
            target="_blank"
            rel="noreferrer"
            onClick={e => e.stopPropagation()}
            className={`text-[10px] font-mono truncate transition-colors ${
              health === 'up'
                ? 'text-green-400/90 hover:text-green-300'
                : health === 'down'
                  ? 'text-red-400/80 hover:text-red-300'
                  : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            {prettyUrl(localUrl)}
          </a>
        </div>
      )}

      {/* Footer row */}
      <div className="flex items-center justify-between gap-2 mt-auto pt-2 border-t border-gray-800/60">
        <div className="flex items-center gap-3">
          <DocCoverage docs={docs} />
          <DeploymentIcons targets={deployment} />
        </div>

        <div className="flex items-center gap-1.5">
          {last_worked && (
            <span className="text-[9px] font-mono text-gray-600 hidden sm:block">
              {last_worked}
            </span>
          )}
          {clean_cmd && (
            <button
              onClick={handleClean}
              title={cleanState === 'armed' ? 'click again to confirm' : `clean: ${clean_cmd}`}
              className={`px-2 py-0.5 rounded text-[9px] font-mono border transition-colors ${
                cleanState === 'armed'
                  ? 'bg-amber-500/15 text-amber-300 border-amber-500/50'
                  : cleanState === 'done'
                    ? 'bg-surface-500 text-green-400 border-green-500/40'
                    : cleanState === 'err'
                      ? 'bg-surface-500 text-red-400 border-red-500/40'
                      : 'bg-surface-500 text-gray-400 border-gray-700/50 hover:border-amber-500/40 hover:text-amber-300'
              }`}
            >
              {cleanLabel}
            </button>
          )}
          {(launch_cmd || localUrl || prodUrl) && (
            <button
              onClick={handleRun}
              title={launch_cmd ?? localUrl ?? prodUrl ?? ''}
              className="px-2 py-0.5 rounded text-[9px] font-mono bg-surface-500 text-gray-400 border border-gray-700/50 hover:border-green-500/40 hover:text-green-400 transition-colors"
            >
              {runLabel}
            </button>
          )}
        </div>
      </div>

      {/* Triage warning dot */}
      {triage_needed && (
        <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
      )}
    </div>
  )
}
