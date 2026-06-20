import { useEffect, useState } from 'react'
import { marked } from 'marked'

interface Props {
  rel: string
  title: string
  onClose: () => void
}

// In-app markdown viewer. Fetches a log file from the dev-server /api/logfile
// endpoint and renders it. Local, trusted content (our own session reports), so
// marked output is injected directly. Stacks above the ProjectDetail panel.
export function LogViewer({ rel, title, onClose }: Props) {
  const [html, setHtml] = useState<string>('')
  const [state, setState] = useState<'loading' | 'ok' | 'err'>('loading')

  useEffect(() => {
    let alive = true
    setState('loading')
    fetch(`/api/logfile?rel=${encodeURIComponent(rel)}`)
      .then(r => (r.ok ? r.text() : Promise.reject(new Error(String(r.status)))))
      .then(md => {
        if (!alive) return
        setHtml(marked.parse(md) as string)
        setState('ok')
      })
      .catch(() => alive && setState('err'))
    return () => {
      alive = false
    }
  }, [rel])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <>
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60]" onClick={onClose} />
      <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none">
        <div className="pointer-events-auto w-full max-w-3xl max-h-[85vh] bg-surface-800 border border-gray-700/60 rounded-lg shadow-2xl flex flex-col">
          <div className="sticky top-0 bg-surface-800/95 backdrop-blur border-b border-gray-700/60 px-5 py-3 flex items-center justify-between gap-4">
            <span className="font-mono text-sm text-amber-300 truncate">📄 {title}</span>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-white transition-colors font-mono text-lg leading-none shrink-0"
            >
              ✕
            </button>
          </div>
          <div className="overflow-y-auto px-6 py-5">
            {state === 'loading' && <p className="text-xs font-mono text-gray-500">loading…</p>}
            {state === 'err' && <p className="text-xs font-mono text-red-400">failed to load this log.</p>}
            {state === 'ok' && (
              <div
                className="log-md text-sm text-gray-300 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            )}
          </div>
        </div>
      </div>
    </>
  )
}
