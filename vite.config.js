import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { pathToFileURL } from 'node:url'
import path from 'node:path'

// Mirrors Vercel's Node.js serverless handler signature so files in /api
// work both locally (via Vite middleware) and in production.
function apiDevServer() {
  return {
    name: 'medbridge-api-dev',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url || !req.url.startsWith('/api/')) return next()
        const [pathname] = req.url.split('?')
        const name = pathname.replace(/^\/api\//, '').replace(/\/$/, '')
        if (!name) return next()
        const file = path.resolve(process.cwd(), 'api', `${name}.js`)
        try {
          const url = pathToFileURL(file).href + `?t=${Date.now()}`
          const mod = await import(url)
          const handler = mod.default
          if (typeof handler !== 'function') {
            res.statusCode = 404
            res.end(JSON.stringify({ error: `No handler at /api/${name}` }))
            return
          }
          if (req.method && req.method !== 'GET' && req.method !== 'HEAD') {
            const chunks = []
            for await (const c of req) chunks.push(c)
            const raw = Buffer.concat(chunks).toString('utf8')
            try { req.body = raw ? JSON.parse(raw) : {} } catch { req.body = {} }
          }
          res.status = (code) => { res.statusCode = code; return res }
          res.json = (obj) => {
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify(obj))
            return res
          }
          await handler(req, res)
        } catch (e) {
          console.error(`[api/${name}]`, e)
          if (!res.headersSent) {
            res.statusCode = 500
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ error: String(e?.message || e) }))
          }
        }
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  for (const k of Object.keys(env)) {
    if (process.env[k] === undefined) process.env[k] = env[k]
  }
  return {
    plugins: [react(), apiDevServer()],
  }
})
