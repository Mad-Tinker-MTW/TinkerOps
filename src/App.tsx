import { useState, useCallback } from 'react'
import type { Project, Registry } from './types/registry'
import { Overview } from './views/Overview'
import { Triage } from './views/Triage'
import { ProjectDetail } from './components/ProjectDetail'
import registryData from '../data/registry.json'

type View = 'overview' | 'triage'

const registry = registryData as unknown as Registry

const triageCount = registry.projects.filter(
  p => p.triage_needed || p.status === 'triage'
).length

export default function App() {
  const [view, setView] = useState<View>('overview')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Project | null>(null)

  const handleSelect = useCallback((p: Project) => setSelected(p), [])
  const handleClose = useCallback(() => setSelected(null), [])

  return (
    <div className="min-h-full flex flex-col bg-surface-900">
      {/* Top nav */}
      <header className="sticky top-0 z-30 bg-surface-800/95 backdrop-blur border-b border-gray-800/80">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 flex items-center gap-4 h-14">
          {/* Logo / wordmark */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-amber-400 font-mono font-bold text-base tracking-tight">
              ⚙ TinkerOps
            </span>
            <span className="text-gray-700 text-xs font-mono hidden sm:block">
              MTW Dev Console
            </span>
          </div>

          <div className="w-px h-5 bg-gray-800 mx-1" />

          {/* Nav tabs */}
          <nav className="flex items-center gap-1">
            <NavTab active={view === 'overview'} onClick={() => { setView('overview'); setSearch('') }}>
              Overview
            </NavTab>
            <NavTab active={view === 'triage'} onClick={() => { setView('triage'); setSearch('') }}>
              Triage
              {triageCount > 0 && (
                <span className="ml-1.5 px-1.5 py-0 rounded-full text-[9px] bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  {triageCount}
                </span>
              )}
            </NavTab>
          </nav>

          {/* Search — only in overview */}
          {view === 'overview' && (
            <div className="ml-auto flex-1 max-w-xs">
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="search projects..."
                className="w-full bg-surface-700 border border-gray-700/60 rounded px-3 py-1.5 text-xs font-mono text-gray-300 placeholder-gray-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20"
              />
            </div>
          )}

          {/* Registry meta */}
          <div className="ml-auto flex items-center gap-3 text-[10px] font-mono text-gray-600 shrink-0">
            <span>{registry._meta.total} projects</span>
            <span className="text-gray-700">·</span>
            <span>v{registry._meta.version}</span>
            <span className="text-gray-700">·</span>
            <span>{registry._meta.generated}</span>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-screen-2xl mx-auto w-full px-4 sm:px-6 py-6">
        {view === 'overview' && (
          <Overview
            registry={registry}
            search={search}
            onSelect={handleSelect}
          />
        )}
        {view === 'triage' && (
          <Triage
            registry={registry}
            onSelect={handleSelect}
          />
        )}
      </main>

      {/* Detail panel */}
      {selected && (
        <ProjectDetail
          project={selected}
          registry={registry}
          onClose={handleClose}
        />
      )}
    </div>
  )
}

function NavTab({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center px-3 py-1.5 rounded text-xs font-mono font-medium transition-colors ${
        active
          ? 'bg-surface-600 text-white border border-gray-700/60'
          : 'text-gray-500 hover:text-gray-300 hover:bg-surface-700'
      }`}
    >
      {children}
    </button>
  )
}
