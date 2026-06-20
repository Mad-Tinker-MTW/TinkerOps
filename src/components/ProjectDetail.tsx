import { useEffect, useState } from 'react'
import type { Project, Registry, PipelineState } from '../types/registry'
import { StatusBadge } from './StatusBadge'
import { DocCoverage } from './DocCoverage'
import { DeploymentIcons } from './DeploymentIcons'
import { StackPill } from './StackPill'
import { PipelinePill } from './PipelinePill'
import { LogViewer } from './LogViewer'

interface LogEntry {
  name: string
  rel: string
  date?: string
  size?: number
}

// Logs section: pulls the project's dated session reports + master LOG.md from
// the dev-server /api/logs endpoint and opens any of them in the in-app viewer.
function LogsSection({ projectId }: { projectId: string }) {
  const [master, setMaster] = useState<LogEntry | null>(null)
  const [entries, setEntries] = useState<LogEntry[]>([])
  const [state, setState] = useState<'loading' | 'ok' | 'err'>('loading')
  const [open, setOpen] = useState<LogEntry | null>(null)

  useEffect(() => {
    let alive = true
    setState('loading')
    fetch(`/api/logs?id=${encodeURIComponent(projectId)}`)
      .then(r => r.json())
      .then(j => {
        if (!alive) return
        if (!j.ok) return setState('err')
        setMaster(j.master ?? null)
        setEntries(j.entries ?? [])
        setState('ok')
      })
      .catch(() => alive && setState('err'))
    return () => { alive = false }
  }, [projectId])

  const hasAny = master || entries.length > 0

  return (
    <div>
      <span className="text-[10px] font-mono text-gray-500 tracking-widest uppercase block mb-2">
        Logs {state === 'ok' && entries.length > 0 && <span className="text-gray-600">({entries.length})</span>}
      </span>

      {state === 'loading' && <p className="text-xs font-mono text-gray-600">loading…</p>}
      {state === 'err' && <p className="text-xs font-mono text-gray-600">logs unavailable (dev server only).</p>}
      {state === 'ok' && !hasAny && <p className="text-xs font-mono text-gray-600">no logs yet.</p>}

      {state === 'ok' && hasAny && (
        <div className="flex flex-col gap-1">
          {master && (
            <button
              onClick={() => setOpen(master)}
              className="text-left text-xs font-mono px-2.5 py-1.5 rounded border border-amber-500/30 bg-amber-500/5 text-amber-300 hover:border-amber-500/60 transition-colors"
            >
              📘 {master.name} <span className="text-amber-500/50">· master log</span>
            </button>
          )}
          {entries.map(e => (
            <button
              key={e.rel}
              onClick={() => setOpen(e)}
              className="text-left text-xs font-mono px-2.5 py-1.5 rounded border border-gray-700/50 text-gray-400 hover:border-gray-600 hover:text-gray-200 transition-colors flex items-center justify-between gap-2"
            >
              <span className="truncate">📄 {e.name}</span>
              {e.date && <span className="text-gray-600 shrink-0">{e.date}</span>}
            </button>
          ))}
        </div>
      )}

      {open && <LogViewer rel={open.rel} title={open.name} onClose={() => setOpen(null)} />}
    </div>
  )
}

interface Props {
  project: Project
  registry: Registry
  pipeline?: PipelineState
  onClose: () => void
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard?.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }
  return (
    <button
      onClick={copy}
      className="shrink-0 text-[10px] font-mono px-2 py-0.5 rounded border border-gray-700/60 text-gray-500 hover:text-gray-300 hover:border-gray-600 transition-colors"
    >
      {copied ? 'copied ✓' : 'copy'}
    </button>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] font-mono text-gray-500 tracking-widest uppercase">{label}</span>
      <div className="font-mono text-sm text-gray-300">{children}</div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value) return null
  return <Field label={label}><span>{value}</span></Field>
}

// Resolve blocked_by chain up to depth 5
function getBlockChain(startId: string, projects: Project[]): Project[] {
  const chain: Project[] = []
  let current = startId
  const seen = new Set<string>()
  while (current && !seen.has(current)) {
    seen.add(current)
    const p = projects.find(x => x.id === current)
    if (!p) break
    chain.push(p)
    current = p.blocked_by ?? ''
  }
  return chain
}

export function ProjectDetail({ project, registry, pipeline, onClose }: Props) {
  const { projects } = registry

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const blockChain = project.blocked_by
    ? getBlockChain(project.blocked_by, projects)
    : []

  // Projects that depend on this one
  const dependents = projects.filter(p => p.blocked_by === project.id)

  const docFields = [
    { key: 'readme',       label: 'README.md' },
    { key: 'claude_md',    label: 'CLAUDE.md' },
    { key: 'status_md',    label: 'STATUS.md' },
    { key: 'pmp',          label: 'PMP docs' },
    { key: 'handoff_md',   label: 'HANDOFF.md' },
    { key: 'design_md',    label: 'DESIGN.md' },
    { key: 'obsidian_note',label: 'Obsidian note' },
  ] as const

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-xl bg-surface-800 border-l border-gray-700/60 overflow-y-auto flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-surface-800/95 backdrop-blur border-b border-gray-700/60 px-6 py-4 flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h2 className="font-mono font-bold text-lg text-white leading-tight">{project.name}</h2>
            <p className="text-xs font-mono text-gray-500 mt-0.5">{project.id}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <StatusBadge status={project.status} size="md" />
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-white transition-colors font-mono text-lg leading-none"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 px-6 py-5 flex flex-col gap-6">

          {/* Summary */}
          <div>
            <p className="text-sm text-gray-400 leading-relaxed">{project.summary}</p>
          </div>

          {/* Pipeline state */}
          {pipeline && (
            <div className="bg-surface-900 rounded-lg border border-gray-700/50 px-4 py-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono text-gray-500 tracking-widest uppercase">
                  Pipeline
                </span>
                <PipelinePill state={pipeline} size="md" />
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs font-mono text-gray-400">
                {pipeline.tasks_total != null && (
                  <span>
                    tasks: {pipeline.tasks_complete ?? 0}/{pipeline.tasks_total}
                    {pipeline.tasks_skipped ? ` · ${pipeline.tasks_skipped} skipped` : ''}
                    {pipeline.tasks_failed ? ` · ${pipeline.tasks_failed} failed` : ''}
                  </span>
                )}
                {pipeline.last_task && <span>last task: {pipeline.last_task}</span>}
                {pipeline.last_commit && <span>commit: {pipeline.last_commit}</span>}
                {pipeline.plan_file && <span>plan: {pipeline.plan_file}</span>}
                {pipeline.last_run && <span className="col-span-2 text-gray-600">updated {pipeline.last_run}</span>}
              </div>
            </div>
          )}

          {/* Core fields */}
          <div className="grid grid-cols-2 gap-4">
            <Row label="Division" value={project.division} />
            <Row label="Port" value={project.port?.toString()} />
            <Row label="Package Manager" value={project.package_manager} />
            <Row label="Last Worked" value={project.last_worked} />
            <Row label="Last Commit" value={project.last_commit} />
            <Row label="PMP ID" value={project.pmp_ids} />
          </div>

          {/* Paths */}
          <div className="flex flex-col gap-2">
            <Field label="Path">
              <code className="text-xs text-gray-400 break-all">{project.path}</code>
            </Field>
            {project.alt_path && (
              <Field label="Alt Path">
                <code className="text-xs text-gray-400 break-all">{project.alt_path}</code>
              </Field>
            )}
          </div>

          {/* Stack */}
          {project.stack.length > 0 && (
            <div>
              <span className="text-[10px] font-mono text-gray-500 tracking-widest uppercase block mb-2">Stack</span>
              <div className="flex flex-wrap gap-1.5">
                {project.stack.map(t => <StackPill key={t} tech={t} />)}
              </div>
            </div>
          )}

          {/* Deployment */}
          {project.deployment.length > 0 && (
            <Field label="Deployment">
              <DeploymentIcons targets={project.deployment} />
              <div className="text-xs text-gray-500 mt-1">{project.deployment.join(' · ')}</div>
            </Field>
          )}

          {/* URLs */}
          {(project.urls.production || project.urls.staging || project.urls.local) && (
            <div>
              <span className="text-[10px] font-mono text-gray-500 tracking-widest uppercase block mb-2">URLs</span>
              <div className="flex flex-col gap-1">
                {project.urls.production && (
                  <a href={project.urls.production} target="_blank" rel="noreferrer"
                    className="text-xs font-mono text-blue-400 hover:text-blue-300 truncate">
                    ↗ {project.urls.production}
                  </a>
                )}
                {project.urls.staging && (
                  <a href={project.urls.staging} target="_blank" rel="noreferrer"
                    className="text-xs font-mono text-blue-400 hover:text-blue-300 truncate">
                    ↗ {project.urls.staging} (staging)
                  </a>
                )}
                {project.urls.local && (
                  <a href={project.urls.local} target="_blank" rel="noreferrer"
                    className="text-xs font-mono text-green-400 hover:text-green-300">
                    ↗ {project.urls.local} (local)
                  </a>
                )}
              </div>
            </div>
          )}

          {/* GitHub */}
          {project.github && (
            <Field label="GitHub">
              <a
                href={`https://github.com/${project.github}`}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-mono text-blue-400 hover:text-blue-300"
              >
                github.com/{project.github}
              </a>
            </Field>
          )}

          {/* Launch */}
          {(project.launch_cmd || project.launch) && (
            <div className="bg-surface-900 rounded-lg border border-gray-700/50 px-4 py-3">
              <span className="text-[10px] font-mono text-gray-500 tracking-widest uppercase block mb-2">Launch</span>
              {project.launch && (
                <code className="text-xs text-amber-400 block mb-1">📄 {project.launch}</code>
              )}
              {project.launch_cmd && (
                <div className="flex items-center justify-between gap-2">
                  <code className="text-xs text-green-400 break-all">$ {project.launch_cmd}</code>
                  <CopyButton text={project.launch_cmd} />
                </div>
              )}
            </div>
          )}

          {/* Doc coverage */}
          <div>
            <span className="text-[10px] font-mono text-gray-500 tracking-widest uppercase block mb-2">Documentation</span>
            <div className="grid grid-cols-2 gap-2">
              {docFields.map(({ key, label }) => {
                const present = project.docs[key]
                return (
                  <div key={key} className="flex items-center gap-2">
                    <span className={`text-sm ${present ? 'text-green-400' : 'text-gray-700'}`}>
                      {present ? '✓' : '○'}
                    </span>
                    <span className={`text-xs font-mono ${present ? 'text-gray-300' : 'text-gray-600'}`}>
                      {label}
                    </span>
                  </div>
                )
              })}
            </div>
            <div className="mt-3">
              <DocCoverage docs={project.docs} showLabels />
            </div>
          </div>

          {/* Tags */}
          {project.tags.length > 0 && (
            <Field label="Tags">
              <div className="flex flex-wrap gap-1.5 mt-1">
                {project.tags.map(tag => (
                  <span key={tag} className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-surface-600 text-gray-400 border border-gray-700/50">
                    #{tag}
                  </span>
                ))}
              </div>
            </Field>
          )}

          {/* Blocked-by chain */}
          {blockChain.length > 0 && (
            <div>
              <span className="text-[10px] font-mono text-amber-500/70 tracking-widest uppercase block mb-2">
                ⛔ Blocked by
              </span>
              <div className="flex flex-col gap-1.5">
                {blockChain.map((p, i) => (
                  <div key={p.id} className="flex items-center gap-2">
                    {i > 0 && <span className="text-gray-700 ml-2">↳</span>}
                    <div className={`flex items-center gap-2 ${i > 0 ? 'ml-2' : ''}`}>
                      <StatusBadge status={p.status} />
                      <span className="text-xs font-mono text-gray-300">{p.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Dependents */}
          {dependents.length > 0 && (
            <div>
              <span className="text-[10px] font-mono text-blue-400/70 tracking-widest uppercase block mb-2">
                ← Blocks
              </span>
              <div className="flex flex-col gap-1.5">
                {dependents.map(p => (
                  <div key={p.id} className="flex items-center gap-2">
                    <StatusBadge status={p.status} />
                    <span className="text-xs font-mono text-gray-300">{p.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          {project.notes && (
            <div className="bg-amber-500/5 border border-amber-500/20 rounded-lg px-4 py-3">
              <span className="text-[10px] font-mono text-amber-400/70 tracking-widest uppercase block mb-1.5">Notes</span>
              <p className="text-xs text-amber-200/70 leading-relaxed font-mono">{project.notes}</p>
            </div>
          )}

          {/* Logs */}
          <LogsSection projectId={project.id} />

        </div>
      </div>
    </>
  )
}
