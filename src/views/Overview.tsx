import { useState } from 'react'
import type { Project, Registry, Status, PipelineStateMap } from '../types/registry'
import { StatCards } from '../components/StatCards'
import { ProjectCard } from '../components/ProjectCard'
import { useUATMoved } from '../hooks/useUATFlags'
import { useOrder } from '../hooks/useOrder'
import { useHealthMap } from '../hooks/useHealth'

const STATUS_ORDER: Status[] = [
  'active',
  'pre-build',
  'dormant',
  'complete',
  'placeholder',
  'triage',
  'archived',
]

interface Props {
  registry: Registry
  pipelineState: PipelineStateMap
  search: string
  onSelect: (p: Project) => void
}

export function Overview({ registry, pipelineState, search, onSelect }: Props) {
  const query = search.toLowerCase().trim()
  const [showUat, setShowUat] = useState(true)
  const { movedCount } = useUATMoved()
  const { getRank, reorder } = useOrder()

  const uatCount = registry.projects.filter(p => p.uat === true).length

  const filtered = registry.projects.filter(p => {
    if (!showUat && p.uat === true) return false
    if (!query) return true
    return (
      p.name.toLowerCase().includes(query) ||
      p.id.toLowerCase().includes(query) ||
      p.summary.toLowerCase().includes(query) ||
      p.tags.some(t => t.toLowerCase().includes(query)) ||
      p.stack.some(t => t.toLowerCase().includes(query)) ||
      p.status.toLowerCase().includes(query)
    )
  })

  // Live reachability for every project that exposes a local URL.
  const localUrls = filtered.map(p => p.urls.local).filter((u): u is string => !!u)
  const health = useHealthMap(localUrls)

  // Manual order is only editable on the full, unfiltered board: positions must
  // reflect the real section, not a search subset.
  const editable = !query

  // Group by status; within each section sort by manual rank, then name.
  const groups = STATUS_ORDER
    .map(status => ({
      status,
      projects: filtered
        .filter(p => p.status === status)
        .sort((a, b) => {
          const ra = getRank(a.id)
          const rb = getRank(b.id)
          if (ra !== rb) return ra - rb
          return a.name.localeCompare(b.name)
        }),
    }))
    .filter(g => g.projects.length > 0)

  return (
    <div className="flex flex-col gap-8">
      {!query && <StatCards registry={registry} />}

      {uatCount > 0 && (
        <div className="flex items-center gap-3 text-[10px] font-mono">
          <button
            type="button"
            onClick={() => setShowUat(v => !v)}
            aria-pressed={showUat}
            title={showUat ? 'Hide UAT coursework from the board' : 'Show UAT coursework on the board'}
            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded border transition-colors ${
              showUat
                ? 'bg-teal-500/15 text-teal-300 border-teal-500/30 hover:border-teal-500/60'
                : 'bg-surface-600 text-gray-500 border-gray-700/50 hover:border-gray-500/60'
            }`}
          >
            <span>UAT coursework</span>
            <span className="opacity-70">{showUat ? 'on' : 'off'}</span>
            <span className="opacity-50">({uatCount})</span>
          </button>
          {movedCount > 0 && (
            <span className="text-red-400/80">
              {movedCount} marked to be moved
            </span>
          )}
        </div>
      )}

      {query && (
        <p className="text-xs font-mono text-gray-500">
          {filtered.length} result{filtered.length !== 1 ? 's' : ''} for "{search}"
        </p>
      )}

      {groups.map(({ status, projects }) => (
        <section key={status}>
          <div className="flex items-center gap-3 mb-3">
            <h2 className="text-xs font-mono font-semibold text-gray-500 tracking-widest uppercase">
              {status}
            </h2>
            <span className="text-xs font-mono text-gray-700">{projects.length}</span>
            <div className="flex-1 border-t border-gray-800/60" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {projects.map((p, i) => (
              <ProjectCard
                key={p.id}
                project={p}
                pipeline={pipelineState[p.id]}
                onClick={onSelect}
                position={i + 1}
                sectionSize={projects.length}
                health={p.urls.local ? (health[p.urls.local] ?? 'unknown') : undefined}
                onReorder={
                  editable
                    ? newPos => reorder(projects.map(x => x.id), p.id, newPos)
                    : undefined
                }
              />
            ))}
          </div>
        </section>
      ))}

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-gray-600 font-mono">
          <span className="text-4xl mb-3">⚙</span>
          <p>No projects match "{search}"</p>
        </div>
      )}
    </div>
  )
}
