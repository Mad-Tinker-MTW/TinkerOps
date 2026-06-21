import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { spawn } from 'node:child_process'
import { readFileSync, writeFileSync, readdirSync, existsSync, statSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

// Local-only launch endpoint. POST /api/launch { id } looks the project up in
// data/registry.json and spawns ITS OWN launch_cmd (never a client-supplied
// string) in a new console at the project path. Dev-server only, bound to
// localhost. This is the one deliberate exception to TinkerOps' "no backend"
// rule, scoped to one-click local launching. Never bind the dev server to a
// non-localhost host while this is enabled.
function launchPlugin() {
  return {
    name: 'tinkerops-launch',
    configureServer(server: any) {
      server.middlewares.use('/api/launch', (req: any, res: any) => {
        const json = (code: number, obj: unknown) => {
          res.statusCode = code
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify(obj))
        }
        if (req.method !== 'POST') return json(405, { ok: false, error: 'POST only' })
        let body = ''
        req.on('data', (c: Buffer) => (body += c))
        req.on('end', () => {
          try {
            const { id } = JSON.parse(body || '{}')
            if (!id) return json(400, { ok: false, error: 'missing id' })
            const regPath = fileURLToPath(new URL('./Data/registry.json', import.meta.url))
            const reg = JSON.parse(readFileSync(regPath, 'utf8'))
            const projects = reg.projects || reg
            const p = Array.isArray(projects) ? projects.find((x: any) => x.id === id) : null
            if (!p) return json(404, { ok: false, error: `unknown project id: ${id}` })
            if (!p.launch_cmd) return json(400, { ok: false, error: `no launch_cmd for ${id}` })
            if (!p.path) return json(400, { ok: false, error: `no path for ${id}` })
            const cmd =
              process.platform === 'win32'
                ? `start "TinkerOps: ${p.id}" cmd /k ${p.launch_cmd}`
                : p.launch_cmd
            const child = spawn(cmd, { cwd: p.path, shell: true, detached: true, stdio: 'ignore' })
            child.unref()
            return json(200, { ok: true, id: p.id, cmd: p.launch_cmd, cwd: p.path })
          } catch (e) {
            return json(500, { ok: false, error: String(e) })
          }
        })
      })
    },
  }
}

// Local-only logs endpoints. Read-only sibling of the launch exception above.
// Session reports for every project live in a shared dir at Q:\MTW\Docs\TinkerOps
// (sessions\ = raw dated reports, logs\ = curated per-project master LOG.md).
// GET /api/logs?id=<project>  -> { master, entries[] } index for that project
// GET /api/logfile?rel=<path> -> raw markdown for one file under the base dir
// Path access is sanitized to the base dir (no traversal) and limited to .md.
// Dev-server only, localhost-bound, same constraints as the launch endpoint.
const LOGS_BASE = fileURLToPath(new URL('../Docs/TinkerOps/', import.meta.url))

// Filename-prefix aliases for projects whose reports use a short code.
const LOG_ALIASES: Record<string, string[]> = {
  TinkerBrain: ['tbrain', 'tinkerbrain'],
}

function matchersFor(id: string): string[] {
  return [id.toLowerCase(), ...(LOG_ALIASES[id] ?? [])]
}

function safeRel(base: string, rel: string): string | null {
  if (!rel || rel.includes('\0')) return null
  const full = fileURLToPath(new URL(rel.replace(/\\/g, '/'), `file://${base.replace(/\\/g, '/')}`))
  const normBase = base.replace(/\\/g, '/').replace(/\/$/, '')
  const normFull = full.replace(/\\/g, '/')
  if (!normFull.startsWith(normBase + '/')) return null
  if (!normFull.toLowerCase().endsWith('.md')) return null
  return full
}

function logsPlugin() {
  return {
    name: 'tinkerops-logs',
    configureServer(server: any) {
      const json = (res: any, code: number, obj: unknown) => {
        res.statusCode = code
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify(obj))
      }

      server.middlewares.use('/api/logs', (req: any, res: any) => {
        try {
          const url = new URL(req.url, 'http://localhost')
          const id = url.searchParams.get('id') ?? ''
          if (!id) return json(res, 400, { ok: false, error: 'missing id' })
          const matchers = matchersFor(id)

          const sessionsDir = LOGS_BASE + 'sessions'
          let entries: any[] = []
          if (existsSync(sessionsDir)) {
            entries = readdirSync(sessionsDir)
              .filter(f => f.toLowerCase().endsWith('.md'))
              .filter(f => matchers.some(m => f.toLowerCase().startsWith(m)))
              .map(f => {
                const date = (f.match(/(\d{4}-\d{2}-\d{2})/) || [])[1] ?? ''
                return { name: f, rel: `sessions/${f}`, date, size: statSync(`${sessionsDir}/${f}`).size }
              })
              .sort((a, b) => (b.date + b.name).localeCompare(a.date + a.name))
          }

          const masterName = `logs/${id}-LOG.md`
          const master = existsSync(LOGS_BASE + masterName) ? { name: `${id}-LOG.md`, rel: masterName } : null

          return json(res, 200, { ok: true, id, master, entries })
        } catch (e) {
          return json(res, 500, { ok: false, error: String(e) })
        }
      })

      server.middlewares.use('/api/logfile', (req: any, res: any) => {
        try {
          const url = new URL(req.url, 'http://localhost')
          const rel = url.searchParams.get('rel') ?? ''
          const full = safeRel(LOGS_BASE, rel)
          if (!full) return json(res, 400, { ok: false, error: 'bad path' })
          if (!existsSync(full)) return json(res, 404, { ok: false, error: 'not found' })
          res.statusCode = 200
          res.setHeader('Content-Type', 'text/markdown; charset=utf-8')
          res.end(readFileSync(full, 'utf8'))
        } catch (e) {
          return json(res, 500, { ok: false, error: String(e) })
        }
      })
    },
  }
}

// Local-only health + order endpoints. Same dev-server-only, localhost-bound
// constraints as the launch/logs exceptions above.
//   POST /api/health { urls[] }  -> { results: { url: 'up' | 'down' } }
//       Server-side reachability probe (dodges browser CORS). A server that
//       answers at all — even 404/500 — counts as up; only a refused/failed
//       connection is down.
//   GET  /api/order              -> { ok, order: { id: rank } }
//   POST /api/order { order }    -> persists Data/ui-order.json (our own small
//       UI-state file, NOT registry.json)
const ORDER_FILE = fileURLToPath(new URL('./Data/ui-order.json', import.meta.url))

async function probe(url: string): Promise<'up' | 'down'> {
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), 2000)
  try {
    const res = await fetch(url, { signal: ctrl.signal, redirect: 'manual' })
    // A reachable service answers 2xx/3xx/4xx (status 0 = opaque redirect, also
    // alive). A 5xx is a gateway/proxy error, e.g. a Cloudflare 502 when a tunnel's
    // origin (the local dev server) is down, so the real service is DOWN, not up.
    return res.status === 0 || (res.status >= 200 && res.status < 500) ? 'up' : 'down'
  } catch {
    return 'down'
  } finally {
    clearTimeout(timer)
  }
}

function healthOrderPlugin() {
  return {
    name: 'tinkerops-health-order',
    configureServer(server: any) {
      const json = (res: any, code: number, obj: unknown) => {
        res.statusCode = code
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify(obj))
      }
      const readBody = (req: any) =>
        new Promise<string>(resolve => {
          let b = ''
          req.on('data', (c: Buffer) => (b += c))
          req.on('end', () => resolve(b))
        })

      server.middlewares.use('/api/health', async (req: any, res: any) => {
        if (req.method !== 'POST') return json(res, 405, { ok: false, error: 'POST only' })
        try {
          const { urls } = JSON.parse((await readBody(req)) || '{}')
          if (!Array.isArray(urls)) return json(res, 400, { ok: false, error: 'urls[] required' })
          const unique = [...new Set(urls.filter((u: unknown) => typeof u === 'string'))] as string[]
          const pairs = await Promise.all(unique.map(async u => [u, await probe(u)] as const))
          return json(res, 200, { ok: true, results: Object.fromEntries(pairs) })
        } catch (e) {
          return json(res, 500, { ok: false, error: String(e) })
        }
      })

      server.middlewares.use('/api/order', async (req: any, res: any) => {
        try {
          if (req.method === 'GET') {
            const order = existsSync(ORDER_FILE) ? JSON.parse(readFileSync(ORDER_FILE, 'utf8')) : {}
            return json(res, 200, { ok: true, order })
          }
          if (req.method === 'POST') {
            const { order } = JSON.parse((await readBody(req)) || '{}')
            if (!order || typeof order !== 'object') return json(res, 400, { ok: false, error: 'order object required' })
            writeFileSync(ORDER_FILE, JSON.stringify(order, null, 2))
            return json(res, 200, { ok: true })
          }
          return json(res, 405, { ok: false, error: 'GET or POST' })
        } catch (e) {
          return json(res, 500, { ok: false, error: String(e) })
        }
      })

      // POST /api/clean { id } runs the project's OWN clean_cmd (looked up in
      // registry.json, never a client-supplied string) at its path, waits for it
      // to finish, and returns the exit code, output tail, and any "freed X" the
      // script reported. Same dev-server-only, localhost constraints as launch.
      server.middlewares.use('/api/clean', async (req: any, res: any) => {
        if (req.method !== 'POST') return json(res, 405, { ok: false, error: 'POST only' })
        try {
          const { id } = JSON.parse((await readBody(req)) || '{}')
          if (!id) return json(res, 400, { ok: false, error: 'missing id' })
          const regPath = fileURLToPath(new URL('./Data/registry.json', import.meta.url))
          const reg = JSON.parse(readFileSync(regPath, 'utf8'))
          const projects = reg.projects || reg
          const p = Array.isArray(projects) ? projects.find((x: any) => x.id === id) : null
          if (!p) return json(res, 404, { ok: false, error: `unknown project id: ${id}` })
          if (!p.clean_cmd) return json(res, 400, { ok: false, error: `no clean_cmd for ${id}` })
          if (!p.path) return json(res, 400, { ok: false, error: `no path for ${id}` })

          const child = spawn(p.clean_cmd, { cwd: p.path, shell: true })
          let out = ''
          let sent = false
          const finish = (code: number, payload: any) => {
            if (sent) return
            sent = true
            json(res, code, payload)
          }
          child.stdout.on('data', (d: Buffer) => (out += d))
          child.stderr.on('data', (d: Buffer) => (out += d))
          child.on('error', (e: any) => finish(500, { ok: false, error: String(e) }))
          child.on('close', (code: number) => {
            const m = out.match(/freed\s+([\d.]+\s*[KMG]?B)/i)
            finish(200, { ok: code === 0, exitCode: code, freed: m ? m[1] : null, output: out.trim().slice(-2000) })
          })
        } catch (e) {
          return json(res, 500, { ok: false, error: String(e) })
        }
      })
    },
  }
}

// Local-only registry endpoint. Read-only sibling of the launch/logs/health
// exceptions above. GET /api/registry returns Data/registry.json read FRESH on
// each request, so a project added or edited by an agent shows up on a plain
// browser refresh without a dev-server rebuild or HMR. The client falls back to
// the bundled import when this is absent (e.g. a production build), so the app
// always renders. Dev-server only, localhost-bound, same constraints as launch.
function registryPlugin() {
  return {
    name: 'tinkerops-registry',
    configureServer(server: any) {
      server.middlewares.use('/api/registry', (req: any, res: any) => {
        if (req.method !== 'GET') {
          res.statusCode = 405
          res.setHeader('Content-Type', 'application/json')
          return res.end(JSON.stringify({ ok: false, error: 'GET only' }))
        }
        try {
          const regPath = fileURLToPath(new URL('./Data/registry.json', import.meta.url))
          res.statusCode = 200
          res.setHeader('Content-Type', 'application/json; charset=utf-8')
          res.setHeader('Cache-Control', 'no-store')
          res.end(readFileSync(regPath, 'utf8'))
        } catch (e) {
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ ok: false, error: String(e) }))
        }
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), launchPlugin(), logsPlugin(), healthOrderPlugin(), registryPlugin()],
  server: {
    // Default 5175; honor a PORT override so tooling can bind a free port when
    // 5175 is held (e.g. a prior dev server left an orphaned socket).
    port: Number(process.env.PORT) || 5175,
  },
})
