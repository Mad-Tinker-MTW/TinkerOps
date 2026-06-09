import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { spawn } from 'node:child_process'
import { readFileSync } from 'node:fs'
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
            const regPath = fileURLToPath(new URL('./data/registry.json', import.meta.url))
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

export default defineConfig({
  plugins: [react(), launchPlugin()],
  server: {
    port: 5175,
  },
})
