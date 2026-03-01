import { Hono } from 'hono'
import type { Bindings } from '../index'

export const inquiriesRoutes = new Hono<{ Bindings: Bindings }>()

// POST /api/inquiries — 提交咨询
inquiriesRoutes.post('/', async (c) => {
  const body = await c.req.json<{
    course_id?: number
    trainer_id?: number
    company_name: string
    contact_name: string
    contact_email?: string
    contact_phone: string
    message?: string
  }>()

  // 基础校验
  if (!body.company_name?.trim()) {
    return c.json({ error: '请填写公司名称' }, 400)
  }
  if (!body.contact_name?.trim()) {
    return c.json({ error: '请填写联系人姓名' }, 400)
  }
  if (!body.contact_phone?.trim()) {
    return c.json({ error: '请填写联系电话' }, 400)
  }

  const db = c.env.DB
  const result = await db
    .prepare(
      `INSERT INTO inquiries (course_id, trainer_id, company_name, contact_name, contact_email, contact_phone, message)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      body.course_id ?? null,
      body.trainer_id ?? null,
      body.company_name.trim(),
      body.contact_name.trim(),
      body.contact_email?.trim() ?? null,
      body.contact_phone.trim(),
      body.message?.trim() ?? null
    )
    .run()

  return c.json(
    {
      data: { id: result.meta.last_row_id },
      message: '咨询已提交，我们会尽快联系您',
    },
    201
  )
})

// GET /api/inquiries — 获取咨询列表（管理用）
inquiriesRoutes.get('/', async (c) => {
  const db = c.env.DB
  const status = c.req.query('status')

  let sql = `
    SELECT i.*,
           c.title as course_title,
           t.name as trainer_name
    FROM inquiries i
    LEFT JOIN courses c ON i.course_id = c.id
    LEFT JOIN trainers t ON i.trainer_id = t.id
  `
  const params: string[] = []

  if (status) {
    sql += ' WHERE i.status = ?'
    params.push(status)
  }

  sql += ' ORDER BY i.created_at DESC'

  const { results } = await db.prepare(sql).bind(...params).all()
  return c.json({ data: results })
})
