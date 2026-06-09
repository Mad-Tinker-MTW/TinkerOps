import type { Project, Registry, Division } from '../types/registry'
import { StatusBadge } from '../components/StatusBadge'

interface Props {
  registry: Registry
  onSelect: (p: Project) => void
}

// Division display order; null projects fall into "Unassigned" last.
const DIVISION_ORDER: Division[] = [
  'Foundry',
  'GemLab',
  'TimeWorks',
  'Games',
  'WebDivision',
  'Tools',
  'Docs',
  'Creative',
]

// Walk a project's blocked_by chain to its root blocker (depth-capped, cycle-safe).
// Returns blocker-first order: [root, ..., leaf].
function buildChain(leafId: string, byId: Map<string, Project>): Project[] {
  const chain: Project[] = []
  const seen = new Set<string>()
  let current: string | null = leafId
  while (current && !seen.has(current)) {
    seen.add(current)
    const p = byId.get(current)
    if (!p) break
    chain.push(p)
    current = p.blocked_by
  }
  return chain.reverse()
}

export function Wiring({ registry, onSelect }: Props) {
  const { projects } = registry
  const byId = new Map(projects.map(p => [p.id, p]))

  // A leaf is a blocked project that nothing else depends on — the tail of a chain.
  const hasDependent = new Set(
    projects.map(p => p.blocked_by).filter((id): id is string => !!id)
  )
  const leaves = projects.filter(p => p.blocked_by && !hasDependent.has(p.id))
  const chains = leaves
    .map(leaf => buildChain(leaf.id, byId))
    .filter(c => c.length > 1)

  // Group by division (null → Unassigned), preserving the canonical order.
  const groups = [...DIVISION_ORDER, null].map(division => ({
    division,
    projects: projects.filter(p => p.division === division),
  })).filter(g => g.projects.length > 0)

  return (
    <div className="flex flex-col gap-10">
      {/* Dependency chains */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-xs font-mono font-semibold text-gray-500 tracking-widest uppercase">
            Dependency Chains
          </h2>
          <span className="text-xs font-mono text-gray-700">{chains.length}</span>
          <div className="flex-1 border-t border-gray-800/60" />
        </div>

        {chains.length === 0 ? (
          <p className="text-xs font-mono text-gray-600">No blocked-by relationships in the registry.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {chains.map(chain => {
              const leaf = chain[chain.length - 1]
              return (
                <div
                  key={leaf.id}
                  className="bg-surface-700 border border-gray-700/50 rounded-lg px-4 py-3"
                >
                  <div className="flex flex-wrap items-center gap-x-1.5 gap-y-2">
                    {chain.map((p, i) => {
                      // A blocker that is complete no longer blocks its dependent.
                      const clears = i < chain.length - 1 && p.status === 'complete'
                      return (
                        <span key={p.id} className="flex items-center gap-1.5">
                          {i > 0 && (
                            <span className={`font-mono text-sm ${clears ? 'text-green-500' : 'text-gray-600'}`}>
                              →
                            </span>
                          )}
                          <button
                            onClick={() => onSelect(p)}
                            className="flex items-center gap-1.5 rounded px-1.5 py-0.5 hover:bg-surface-500 transition-colors"
                          >
                            <span className="text-xs font-mono text-gray-300">{p.name}</span>
                            <StatusBadge status={p.status} />
                          </button>
                        </span>
                      )
                    })}
                  </div>
                  {chain.some((p, i) => i < chain.length - 1 && p.status === 'complete') && (
                    <p className="text-[10px] font-mono text-green-500/70 mt-2">
                      ✓ A blocker is complete — downstream work may be unblocked.
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </section>

      {/* Divisions */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-xs font-mono font-semibold text-gray-500 tracking-widest uppercase">
            Divisions
          </h2>
          <span className="text-xs font-mono text-gray-700">{groups.length}</span>
          <div className="flex-1 border-t border-gray-800/60" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {groups.map(({ division, projects }) => (
            <div
              key={division ?? 'unassigned'}
              className="bg-surface-700 border border-gray-700/50 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-mono font-semibold text-sm text-gray-300">
                  {division ?? 'Unassigned'}
                </h3>
                <span className="text-xs font-mono text-gray-600">{projects.length}</span>
              </div>
              <div className="flex flex-col gap-1">
                {projects.map(p => (
                  <button
                    key={p.id}
                    onClick={() => onSelect(p)}
                    className="flex items-center justify-between gap-2 rounded px-2 py-1 hover:bg-surface-500 transition-colors text-left"
                  >
                    <span className="text-xs font-mono text-gray-400 truncate">{p.name}</span>
                    <StatusBadge status={p.status} />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
