import type { Registry } from '../types/registry'
import { docCoveragePercent } from './DocCoverage'

interface StatCardProps {
  label: string
  value: string | number
  sub?: string
  accent: string
}

function StatCard({ label, value, sub, accent }: StatCardProps) {
  return (
    <div className={`bg-surface-700 border ${accent} rounded-lg px-5 py-4 flex flex-col gap-1`}>
      <span className="text-xs font-mono text-gray-500 tracking-widest uppercase">{label}</span>
      <span className="text-3xl font-mono font-bold text-white">{value}</span>
      {sub && <span className="text-xs font-mono text-gray-500">{sub}</span>}
    </div>
  )
}

interface Props {
  registry: Registry
}

export function StatCards({ registry }: Props) {
  const { _meta, projects } = registry
  const triageCount = projects.filter(p => p.triage_needed || p.status === 'triage').length
  const coverage = docCoveragePercent(projects)

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        label="Total Projects"
        value={_meta.total}
        sub={`across ${projects.filter(p => p.division).map(p => p.division).filter((v, i, a) => a.indexOf(v) === i).length} divisions`}
        accent="border-gray-700/50"
      />
      <StatCard
        label="Active"
        value={_meta.active}
        sub="currently in progress"
        accent="border-green-500/30"
      />
      <StatCard
        label="Triage Needed"
        value={triageCount}
        sub="need attention"
        accent="border-amber-500/30"
      />
      <StatCard
        label="Doc Coverage"
        value={`${coverage}%`}
        sub="README · CLAUDE.md · STATUS · PMP"
        accent={coverage >= 70 ? 'border-teal-500/30' : coverage >= 40 ? 'border-amber-500/30' : 'border-red-500/30'}
      />
    </div>
  )
}
