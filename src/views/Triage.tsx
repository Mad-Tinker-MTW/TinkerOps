import type { Project, Registry } from '../types/registry'
import { StatusBadge } from '../components/StatusBadge'
import { StackPill } from '../components/StackPill'

interface MissingInfo {
  label: string
  present: boolean
}

function getMissingInfo(p: Project): MissingInfo[] {
  return [
    { label: 'README',     present: p.docs.readme },
    { label: 'CLAUDE.md',  present: p.docs.claude_md },
    { label: 'STATUS.md',  present: p.docs.status_md },
    { label: 'PMP',        present: p.docs.pmp },
    { label: 'Summary',    present: p.summary.length > 20 },
    { label: 'Stack',      present: p.stack.length > 0 },
    { label: 'Deployment', present: p.deployment.length > 0 },
    { label: 'Last worked',present: p.last_worked !== null },
  ]
}

interface TriageCardProps {
  project: Project
  onClick: (p: Project) => void
}

function TriageCard({ project, onClick }: TriageCardProps) {
  const missing = getMissingInfo(project).filter(m => !m.present)

  return (
    <div
      onClick={() => onClick(project)}
      className="bg-surface-700 border border-amber-500/30 rounded-lg p-4 cursor-pointer hover:border-amber-500/60 hover:bg-surface-600 transition-all duration-150 ring-1 ring-amber-500/10"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-mono font-semibold text-sm text-white truncate">{project.name}</h3>
          <p className="text-[10px] font-mono text-gray-500 mt-0.5">{project.id} · {project.path}</p>
        </div>
        <StatusBadge status={project.status} />
      </div>

      {/* Summary if known */}
      {project.summary && project.summary.length > 20 && (
        <p className="text-[11px] text-gray-500 leading-relaxed line-clamp-2 mb-3">
          {project.summary}
        </p>
      )}

      {/* Stack if known */}
      {project.stack.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {project.stack.slice(0, 6).map(t => <StackPill key={t} tech={t} />)}
        </div>
      )}

      {/* Missing info */}
      {missing.length > 0 && (
        <div className="mt-3 pt-3 border-t border-amber-500/10">
          <p className="text-[10px] font-mono text-amber-500/60 uppercase tracking-widest mb-1.5">
            Missing
          </p>
          <div className="flex flex-wrap gap-1.5">
            {missing.map(m => (
              <span
                key={m.label}
                className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-amber-500/10 text-amber-400/80 border border-amber-500/20"
              >
                {m.label}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Notes */}
      {project.notes && (
        <p className="text-[10px] font-mono text-amber-300/50 mt-2 italic line-clamp-1">
          ↳ {project.notes}
        </p>
      )}
    </div>
  )
}

interface Props {
  registry: Registry
  onSelect: (p: Project) => void
}

export function Triage({ registry, onSelect }: Props) {
  const triageProjects = registry.projects.filter(
    p => p.triage_needed || p.status === 'triage'
  )

  const totalMissing = triageProjects.reduce((sum, p) => {
    return sum + getMissingInfo(p).filter(m => !m.present).length
  }, 0)

  return (
    <div className="flex flex-col gap-6">
      {/* Triage header */}
      <div className="bg-amber-500/5 border border-amber-500/20 rounded-lg px-5 py-4 flex items-center gap-4">
        <span className="text-2xl">⚠</span>
        <div>
          <h2 className="font-mono font-bold text-amber-400">
            {triageProjects.length} project{triageProjects.length !== 1 ? 's' : ''} need triage
          </h2>
          <p className="text-xs font-mono text-amber-400/60 mt-0.5">
            {totalMissing} missing fields across all triage projects · Click any card to open the full record
          </p>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {triageProjects.map(p => (
          <TriageCard key={p.id} project={p} onClick={onSelect} />
        ))}
      </div>

      {triageProjects.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-gray-600 font-mono">
          <span className="text-4xl mb-3">✓</span>
          <p>All clear — no triage needed</p>
        </div>
      )}
    </div>
  )
}
