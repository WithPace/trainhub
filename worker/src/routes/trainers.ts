import { Hono } from 'hono'
import type { Bindings } from '../index'

export const trainersRoutes = new Hono<{ Bindings: Bindings }>()

// GET /api/trainers — 获取培训师列表（支持筛选）
trainersRoutes.get('/', async (c) => {
  const db = c.env.DB
  const city = c.req.query('city')
  const featured = c.req.query('featured')
  const search = c.req.query('q')

  let sql = 'SELECT * FROM trainers WHERE status = ?'
  const params: (string | number)[] = ['active']

  if (city) {
    sql += ' AND city = ?'
    params.push(city)
  }

  if (featured === 'true') {
    sql += ' AND featured = 1'
  }

  if (search) {
    sql += ' AND (name LIKE ? OR title LIKE ? OR bio LIKE ? OR specialties LIKE ?)'
    const term = `%${search}%`
    params.push(term, term, term, term)
  }

  sql += ' ORDER BY featured DESC, rating DESC'

  const { results } = await db.prepare(sql).bind(...params).all()

  // specialties 存为 JSON 字符串，需要解析
  const trainers = (results || []).map((t: Record<string, unknown>) => ({
    ...t,
    specialties: parseJson(t.specialties as string, []),
    featured: Boolean(t.featured),
  }))

  return c.json({ data: trainers })
})

// GET /api/trainers/:id — 获取单个培训师详情（含课程）
trainersRoutes.get('/:id', async (c) => {
  const id = Number(c.req.param('id'))
  if (isNaN(id)) {
    return c.json({ error: 'Invalid trainer ID' }, 400)
  }

  const db = c.env.DB
  const trainer = await db
    .prepare('SELECT * FROM trainers WHERE id = ? AND status = ?')
    .bind(id, 'active')
    .first()

  if (!trainer) {
    return c.json({ error: 'Trainer not found' }, 404)
  }

  // 获取该培训师的课程
  const { results: courses } = await db
    .prepare(
      `SELECT c.*, cat.name as category_name, cat.slug as category_slug
       FROM courses c
       LEFT JOIN categories cat ON c.category_id = cat.id
       WHERE c.trainer_id = ? AND c.status = ?
       ORDER BY c.featured DESC, c.id`
    )
    .bind(id, 'active')
    .all()

  const parsedCourses = (courses || []).map((course: Record<string, unknown>) => ({
    ...course,
    outline: parseJson(course.outline as string, []),
    featured: Boolean(course.featured),
  }))

  return c.json({
    data: {
      ...trainer,
      specialties: parseJson(trainer.specialties as string, []),
      featured: Boolean(trainer.featured),
      courses: parsedCourses,
    },
  })
})

/** 安全解析 JSON 字符串 */
function parseJson<T>(str: string | null | undefined, fallback: T): T {
  if (!str) return fallback
  try {
    return JSON.parse(str)
  } catch {
    return fallback
  }
}
