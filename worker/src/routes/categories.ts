import { Hono } from 'hono'
import type { Bindings } from '../index'

export const categoriesRoutes = new Hono<{ Bindings: Bindings }>()

// GET /api/categories — 获取所有分类
categoriesRoutes.get('/', async (c) => {
  const db = c.env.DB
  const { results } = await db.prepare('SELECT * FROM categories ORDER BY id').all()
  return c.json({ data: results })
})

// GET /api/categories/:slug — 按 slug 获取分类
categoriesRoutes.get('/:slug', async (c) => {
  const slug = c.req.param('slug')
  const db = c.env.DB
  const category = await db
    .prepare('SELECT * FROM categories WHERE slug = ?')
    .bind(slug)
    .first()

  if (!category) {
    return c.json({ error: 'Category not found' }, 404)
  }
  return c.json({ data: category })
})
