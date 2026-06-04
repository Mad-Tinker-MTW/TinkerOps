// Colour-coded stack technology pills
const STACK_COLORS: Record<string, string> = {
  React:          'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
  TypeScript:     'bg-blue-500/15 text-blue-400 border-blue-500/30',
  JavaScript:     'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
  Python:         'bg-yellow-600/15 text-yellow-500 border-yellow-600/30',
  Rust:           'bg-orange-600/15 text-orange-400 border-orange-600/30',
  Vite:           'bg-purple-500/15 text-purple-400 border-purple-500/30',
  Tailwind:       'bg-sky-500/15 text-sky-400 border-sky-500/30',
  Svelte:         'bg-orange-500/15 text-orange-400 border-orange-500/30',
  'Node.js':      'bg-green-600/15 text-green-400 border-green-600/30',
  Express:        'bg-gray-500/15 text-gray-400 border-gray-500/30',
  FastAPI:        'bg-teal-500/15 text-teal-400 border-teal-500/30',
  Flask:          'bg-gray-600/15 text-gray-400 border-gray-600/30',
  SQLite:         'bg-blue-700/15 text-blue-300 border-blue-700/30',
  'Tauri v2':     'bg-amber-600/15 text-amber-400 border-amber-600/30',
  Bun:            'bg-pink-500/15 text-pink-400 border-pink-500/30',
  HTML:           'bg-red-500/15 text-red-400 border-red-500/30',
  CSS:            'bg-blue-400/15 text-blue-300 border-blue-400/30',
  PowerShell:     'bg-blue-600/15 text-blue-300 border-blue-600/30',
  'Anthropic API':'bg-amber-500/15 text-amber-400 border-amber-500/30',
  Supabase:       'bg-green-500/15 text-green-400 border-green-500/30',
  Cargo:          'bg-orange-700/15 text-orange-400 border-orange-700/30',
}

const DEFAULT = 'bg-surface-600 text-gray-400 border-gray-600/30'

interface Props {
  tech: string
}

export function StackPill({ tech }: Props) {
  const colors = STACK_COLORS[tech] ?? DEFAULT
  return (
    <span
      className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-mono font-medium border ${colors}`}
    >
      {tech}
    </span>
  )
}
