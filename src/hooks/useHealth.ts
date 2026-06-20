import { useEffect, useRef, useState } from 'react'

export type Health = 'up' | 'down' | 'unknown'

const POLL_MS = 15_000

/**
 * Live reachability for a set of project URLs. Posts the unique URLs to the
 * dev-server /api/health endpoint (which probes them server-side to avoid
 * browser CORS) on mount and every 15s, returning a { url: 'up' | 'down' } map.
 * URLs not yet checked report 'unknown'. Used by the Overview to light each
 * card's status dot. No-ops gracefully if the endpoint is unavailable (e.g. a
 * production build with no dev middleware).
 */
export function useHealthMap(urls: string[]): Record<string, Health> {
  const [map, setMap] = useState<Record<string, Health>>({})
  // Stable key so the effect only restarts when the URL set actually changes.
  const key = [...new Set(urls)].sort().join('|')
  const urlsRef = useRef<string[]>([])
  urlsRef.current = [...new Set(urls)]

  useEffect(() => {
    if (urlsRef.current.length === 0) return
    let alive = true

    const poll = async () => {
      try {
        const r = await fetch('/api/health', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ urls: urlsRef.current }),
        })
        const j = await r.json()
        if (alive && j.ok) setMap(j.results)
      } catch {
        /* endpoint unavailable — leave statuses as-is */
      }
    }

    poll()
    const t = setInterval(poll, POLL_MS)
    return () => {
      alive = false
      clearInterval(t)
    }
  }, [key])

  return map
}
