import type { Project } from '../types/registry'
import { StatusBadge } from './StatusBadge'
import { DocCoverage } from './DocCoverage'
import { DeploymentIcons } from './DeploymentIcons'
import { StackPill } from './StackPill'

const MAX_STACK_PILLS = 5

interface Props {
  project: Project
  onClick: (p: Project) => void
  highlight?: boolean
}

export function ProjectCard({ project, onClick, highlight = false }: Props) {
  const {
    name,
    status,
    stack,
    deployment,
    docs,
    launch_cmd,
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

  const borderColor = highlight
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
        <StatusBadge status={status} />
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
          {(launch_cmd || localUrl || prodUrl) && (
            <button
              onClick={e => {
                e.stopPropagation()
                if (localUrl) window.open(localUrl, '_blank')
                else if (prodUrl) window.open(prodUrl, '_blank')
              }}
              title={launch_cmd ?? localUrl ?? prodUrl ?? ''}
              className="px-2 py-0.5 rounded text-[9px] font-mono bg-surface-500 text-gray-400 border border-gray-700/50 hover:border-green-500/40 hover:text-green-400 transition-colors"
            >
              {localUrl || prodUrl ? '↗ launch' : '$ run'}
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
