import { useState } from 'react'
import type { Project, Registry, Status, PipelineStateMap } from '../types/registry'
import { StatCards } from '../components/StatCards'
import { ProjectCard } from '../components/ProjectCard'
import { useUATMoved } from '../hooks/useUATFlags'

const STATUS_ORDER: Status[] = [
  'active',
  'pre-build',
  'dormant',
  'complete',
  'placeholder',
  'triage',
  'archived',
]

function sortProjects(projects: Project[]): Project[] {
  return [...projects].sort((a, b) => {
    const ai = STATUS_ORDER.indexOf(a.status)
    const bi = STATUS_ORDER.indexOf(b.status)
    if (ai !== bi) return ai - bi
    return a.name.localeCompare(b.name)
  })
}

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

  const sorted = sortProjects(filtered)

  // Group by status for section headers
  const groups = STATUS_ORDER
    .map(status => ({
      status,
      projects: sorted.filter(p => p.status === status),
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
            {projects.map(p => (
              <ProjectCard
                key={p.id}
                project={p}
                pipeline={pipelineState[p.id]}
                onClick={onSelect}
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
