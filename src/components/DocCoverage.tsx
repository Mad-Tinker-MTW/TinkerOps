import type { Docs } from '../types/registry'

interface DocCheck {
  key: keyof Pick<Docs, 'readme' | 'claude_md' | 'status_md' | 'pmp'>
  label: string
  abbrev: string
}

const CHECKS: DocCheck[] = [
  { key: 'readme',    label: 'README',    abbrev: 'RE' },
  { key: 'claude_md', label: 'CLAUDE.md', abbrev: 'CL' },
  { key: 'status_md', label: 'STATUS.md', abbrev: 'ST' },
  { key: 'pmp',       label: 'PMP',       abbrev: 'PM' },
]

interface Props {
  docs: Docs
  showLabels?: boolean
}

export function DocCoverage({ docs, showLabels = false }: Props) {
  const score = CHECKS.filter(c => docs[c.key]).length

  return (
    <div className="flex items-center gap-1.5">
      {CHECKS.map(({ key, label, abbrev }) => {
        const present = docs[key]
        return (
          <div
            key={key}
            title={label}
            className={`flex items-center justify-center rounded text-[9px] font-mono font-bold tracking-wide ${
              showLabels ? 'px-1.5 py-0.5' : 'w-6 h-5'
            } ${
              present
                ? 'bg-green-500/20 text-green-400 border border-green-500/40'
                : 'bg-surface-600 text-gray-600 border border-gray-700/50'
            }`}
          >
            {showLabels ? label : abbrev}
          </div>
        )
      })}
      <span className="text-[10px] font-mono text-gray-500 ml-1">{score}/4</span>
    </div>
  )
}

export function docCoveragePercent(projects: { docs: Docs }[]): number {
  if (!projects.length) return 0
  const total = projects.length * CHECKS.length
  const present = projects.reduce(
    (sum, p) => sum + CHECKS.filter(c => p.docs[c.key]).length,
    0
  )
  return Math.round((present / total) * 100)
}
