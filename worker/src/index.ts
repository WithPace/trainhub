import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { categoriesRoutes } from './routes/categories'
import { trainersRoutes } from './routes/trainers'
import { coursesRoutes } from './routes/courses'
import { inquiriesRoutes } from './routes/inquiries'

export type Bindings = {
  DB: D1Database
  ENVIRONMENT: string
}

const app = new Hono<{ Bindings: Bindings }>()

// CORS — 允许前端跨域访问
app.use(
  '/api/*',
  cors({
    origin: ['http://localhost:5173', 'https://withpace.github.io'],
    allowMethods: ['GET', 'POST', 'OPTIONS'],
    allowHeaders: ['Content-Type'],
  })
)

// Health check
app.get('/api/health', (c) => c.json({ status: 'ok', timestamp: new Date().toISOString() }))

// 路由挂载
app.route('/api/categories', categoriesRoutes)
app.route('/api/trainers', trainersRoutes)
app.route('/api/courses', coursesRoutes)
app.route('/api/inquiries', inquiriesRoutes)

// 404 fallback
app.notFound((c) => c.json({ error: 'Not Found' }, 404))

// 全局错误处理
app.onError((err, c) => {
  console.error('Unhandled error:', err)
  return c.json({ error: 'Internal Server Error' }, 500)
})

export default app
