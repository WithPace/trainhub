import type { Category, Trainer, Course, Inquiry } from '@/types'

// API 基地址 — 生产环境从环境变量读取，开发环境通过 Vite proxy 代理
const API_BASE = import.meta.env.VITE_API_BASE || ''

/** 是否启用后端 API（VITE_USE_API=true 或 VITE_API_BASE 非空） */
const useApi = import.meta.env.VITE_USE_API === 'true' || Boolean(API_BASE)

// 动态加载 mock 数据 — 避免将培训师/课程数据打包进主 chunk
// 缓存后续调用直接返回，不重复加载
let _mockCache: Awaited<typeof import('@/data/mock')> | null = null
async function getMock() {
  if (!_mockCache) _mockCache = await import('@/data/mock')
  return _mockCache
}

/** 统一 fetch 封装 */
async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error((body as { error?: string }).error || `API error: ${res.status}`)
  }

  const json = (await res.json()) as { data: T }
  return json.data
}

// ─── Categories ───

export async function getCategories(): Promise<Category[]> {
  if (!useApi) {
    const mock = await getMock()
    return mock.categories
  }
  return apiFetch<Category[]>('/api/categories')
}

// ─── Trainers ───

export interface TrainerFilters {
  city?: string
  featured?: boolean
  q?: string
}

export async function getTrainers(filters?: TrainerFilters): Promise<Trainer[]> {
  if (!useApi) {
    const mock = await getMock()
    let result = [...mock.trainers]
    if (filters?.featured) result = result.filter((t) => t.featured)
    if (filters?.city) result = result.filter((t) => t.city === filters.city)
    if (filters?.q) {
      const q = filters.q.toLowerCase()
      result = result.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.title.toLowerCase().includes(q) ||
          t.specialties.some((s) => s.toLowerCase().includes(q))
      )
    }
    return result
  }

  const params = new URLSearchParams()
  if (filters?.city) params.set('city', filters.city)
  if (filters?.featured) params.set('featured', 'true')
  if (filters?.q) params.set('q', filters.q)
  const qs = params.toString()
  return apiFetch<Trainer[]>(`/api/trainers${qs ? `?${qs}` : ''}`)
}

export async function getTrainerById(id: number): Promise<Trainer | null> {
  if (!useApi) {
    const mock = await getMock()
    const trainer = mock.getTrainerById(id)
    if (!trainer) return null
    return { ...trainer, courses: mock.getCoursesByTrainerId(id) }
  }
  return apiFetch<Trainer>(`/api/trainers/${id}`).catch(() => null)
}

// ─── Courses ───

export interface CourseFilters {
  category?: string
  trainer_id?: number
  featured?: boolean
  q?: string
}

export async function getCourses(filters?: CourseFilters): Promise<Course[]> {
  if (!useApi) {
    const mock = await getMock()
    let result = [...mock.courses]
    if (filters?.category) {
      const cat = mock.categories.find((c) => c.slug === filters.category)
      if (cat) result = result.filter((c) => c.category_id === cat.id)
    }
    if (filters?.trainer_id) result = result.filter((c) => c.trainer_id === filters.trainer_id)
    if (filters?.featured) result = result.filter((c) => c.featured)
    if (filters?.q) {
      const q = filters.q.toLowerCase()
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          (c.trainer_name && c.trainer_name.toLowerCase().includes(q))
      )
    }
    return result
  }

  const params = new URLSearchParams()
  if (filters?.category) params.set('category', filters.category)
  if (filters?.trainer_id) params.set('trainer_id', String(filters.trainer_id))
  if (filters?.featured) params.set('featured', 'true')
  if (filters?.q) params.set('q', filters.q)
  const qs = params.toString()
  return apiFetch<Course[]>(`/api/courses${qs ? `?${qs}` : ''}`)
}

export async function getCourseById(id: number): Promise<Course | null> {
  if (!useApi) {
    const mock = await getMock()
    return mock.getCourseById(id) ?? null
  }
  return apiFetch<Course>(`/api/courses/${id}`).catch(() => null)
}

// ─── Related / Recommendations ───

/** 获取同分类的相关课程（排除当前课程） */
export async function getRelatedCourses(
  courseId: number,
  categoryName: string,
  limit = 3
): Promise<Course[]> {
  if (!useApi) {
    const mock = await getMock()
    return mock.courses
      .filter((c) => c.category_name === categoryName && c.id !== courseId)
      .slice(0, limit)
  }
  const params = new URLSearchParams({
    exclude: String(courseId),
    category: categoryName,
    limit: String(limit),
  })
  return apiFetch<Course[]>(`/api/courses/related?${params}`)
}

/** 获取同领域的相关培训师（排除当前培训师） */
export async function getRelatedTrainers(
  trainerId: number,
  categories: string[],
  limit = 3
): Promise<Trainer[]> {
  if (!useApi) {
    const mock = await getMock()
    return mock.trainers
      .filter(
        (t) =>
          t.id !== trainerId &&
          t.specialties.some((s) => categories.includes(s))
      )
      .slice(0, limit)
  }
  const params = new URLSearchParams({
    exclude: String(trainerId),
    specialties: categories.join(','),
    limit: String(limit),
  })
  return apiFetch<Trainer[]>(`/api/trainers/related?${params}`)
}

// ─── Inquiries ───

/** 外部表单服务端点（Formspree / Getform / Web3Forms 等） */
const FORM_ENDPOINT = import.meta.env.VITE_FORM_ENDPOINT || ''

export async function submitInquiry(
  inquiry: Inquiry
): Promise<{ id: number; message: string }> {
  // 优先使用后端 API
  if (useApi) {
    const data = await apiFetch<{ id: number }>('/api/inquiries', {
      method: 'POST',
      body: JSON.stringify(inquiry),
    })
    return { ...data, message: '咨询已提交，我们会尽快联系您' }
  }

  // 其次使用外部表单服务（适用于 GitHub Pages 等静态部署）
  if (FORM_ENDPOINT) {
    const res = await fetch(FORM_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        company_name: inquiry.company_name,
        contact_name: inquiry.contact_name,
        contact_phone: inquiry.contact_phone,
        message: inquiry.message || '',
        course_id: inquiry.course_id,
        trainer_id: inquiry.trainer_id,
        _subject: `TrainHub 新咨询 - ${inquiry.company_name}`,
      }),
    })
    if (!res.ok) throw new Error('表单提交失败，请稍后重试')
    return { id: Date.now(), message: '咨询已提交，我们会尽快联系您' }
  }

  // 兜底：保存到 localStorage + 打开 mailto:
  const submissions = JSON.parse(localStorage.getItem('trainhub_inquiries') || '[]')
  submissions.push({ ...inquiry, submitted_at: new Date().toISOString() })
  localStorage.setItem('trainhub_inquiries', JSON.stringify(submissions))

  // 构建 mailto: 链接
  const subject = encodeURIComponent(`TrainHub 培训咨询 — ${inquiry.company_name}`)
  const body = encodeURIComponent(
    `企业培训咨询\n\n` +
    `公司：${inquiry.company_name}\n` +
    `联系人：${inquiry.contact_name}\n` +
    `电话：${inquiry.contact_phone}\n` +
    `需求：${inquiry.message || '（未填写）'}\n`
  )
  window.open(`mailto:hi@trainhub.cn?subject=${subject}&body=${body}`, '_blank')

  return { id: Date.now(), message: '咨询已提交，我们会尽快联系您' }
}

// ─── Utils ───

export async function getAllCities(): Promise<string[]> {
  const mock = await getMock()
  return mock.getAllCities()
}

export async function getAllSpecialties(): Promise<string[]> {
  const mock = await getMock()
  return mock.getAllSpecialties()
}
