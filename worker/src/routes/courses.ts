import { Hono } from 'hono'
import type { Bindings } from '../index'

export const coursesRoutes = new Hono<{ Bindings: Bindings }>()

// GET /api/courses — 获取课程列表（支持筛选）
coursesRoutes.get('/', async (c) => {
  const db = c.env.DB
  const categorySlug = c.req.query('category')
  const trainerId = c.req.query('trainer_id')
  const featured = c.req.query('featured')
  const search = c.req.query('q')

  let sql = `
    SELECT c.*,
           t.name as trainer_name, t.title as trainer_title, t.avatar_url as trainer_avatar,
           cat.name as category_name, cat.slug as category_slug
    FROM courses c
    LEFT JOIN trainers t ON c.trainer_id = t.id
    LEFT JOIN categories cat ON c.category_id = cat.id
    WHERE c.status = ?
  `
  const params: (string | number)[] = ['active']

  if (categorySlug) {
    sql += ' AND cat.slug = ?'
    params.push(categorySlug)
  }

  if (trainerId) {
    sql += ' AND c.trainer_id = ?'
    params.push(Number(trainerId))
  }

  if (featured === 'true') {
    sql += ' AND c.featured = 1'
  }

  if (search) {
    sql += ' AND (c.title LIKE ? OR c.description LIKE ? OR t.name LIKE ?)'
    const term = `%${search}%`
    params.push(term, term, term)
  }

  sql += ' ORDER BY c.featured DESC, c.id'

  const { results } = await db.prepare(sql).bind(...params).all()

  const courses = (results || []).map((course: Record<string, unknown>) => ({
    ...course,
    outline: parseJson(course.outline as string, []),
    featured: Boolean(course.featured),
  }))

  return c.json({ data: courses })
})

// GET /api/courses/:id — 获取单门课程详情
coursesRoutes.get('/:id', async (c) => {
  const id = Number(c.req.param('id'))
  if (isNaN(id)) {
    return c.json({ error: 'Invalid course ID' }, 400)
  }

  const db = c.env.DB
  const course = await db
    .prepare(
      `SELECT c.*,
              t.name as trainer_name, t.title as trainer_title,
              t.avatar_url as trainer_avatar, t.bio as trainer_bio,
              t.years_experience as trainer_years, t.rating as trainer_rating,
              cat.name as category_name, cat.slug as category_slug
       FROM courses c
       LEFT JOIN trainers t ON c.trainer_id = t.id
       LEFT JOIN categories cat ON c.category_id = cat.id
       WHERE c.id = ? AND c.status = ?`
    )
    .bind(id, 'active')
    .first()

  if (!course) {
    return c.json({ error: 'Course not found' }, 404)
  }

  return c.json({
    data: {
      ...course,
      outline: parseJson(course.outline as string, []),
      featured: Boolean(course.featured),
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
