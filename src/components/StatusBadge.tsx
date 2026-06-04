import type { Status } from '../types/registry'

const CONFIG: Record<Status, { label: string; className: string }> = {
  active:      { label: 'ACTIVE',       className: 'bg-green-500/15 text-green-400 border border-green-500/30' },
  dormant:     { label: 'DORMANT',      className: 'bg-gray-500/15 text-gray-400 border border-gray-500/30' },
  'pre-build': { label: 'PRE-BUILD',    className: 'bg-blue-500/15 text-blue-400 border border-blue-500/30' },
  triage:      { label: 'TRIAGE',       className: 'bg-amber-500/15 text-amber-400 border border-amber-500/30' },
  placeholder: { label: 'PLACEHOLDER',  className: 'bg-purple-500/15 text-purple-400 border border-purple-500/30' },
  complete:    { label: 'COMPLETE',     className: 'bg-teal-500/15 text-teal-400 border border-teal-500/30' },
  archived:    { label: 'ARCHIVED',     className: 'bg-red-500/15 text-red-400 border border-red-500/30' },
}

interface Props {
  status: Status
  size?: 'sm' | 'md'
}

export function StatusBadge({ status, size = 'sm' }: Props) {
  const { label, className } = CONFIG[status]
  const sizeClass = size === 'md'
    ? 'px-2.5 py-1 text-xs'
    : 'px-2 py-0.5 text-[10px]'

  return (
    <span className={`inline-flex items-center rounded font-mono font-semibold tracking-widest ${sizeClass} ${className}`}>
      {label}
    </span>
  )
}
