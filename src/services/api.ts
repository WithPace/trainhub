import type { Category, Trainer, Course, Inquiry } from '@/types'
import * as mock from '@/data/mock'

// API 基地址 — 生产环境从环境变量读取，开发环境通过 Vite proxy 代理
const API_BASE = import.meta.env.VITE_API_BASE || ''

/** 是否启用后端 API（VITE_USE_API=true 或 VITE_API_BASE 非空） */
const useApi = import.meta.env.VITE_USE_API === 'true' || Boolean(API_BASE)

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
  if (!useApi) return mock.categories
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
  if (!useApi) return mock.getCourseById(id) ?? null
  return apiFetch<Course>(`/api/courses/${id}`).catch(() => null)
}

// ─── Inquiries ───

export async function submitInquiry(
  inquiry: Inquiry
): Promise<{ id: number; message: string }> {
  if (!useApi) {
    // Mock: 模拟提交成功
    console.log('[mock] Inquiry submitted:', inquiry)
    return { id: Date.now(), message: '咨询已提交，我们会尽快联系您' }
  }

  const data = await apiFetch<{ id: number }>('/api/inquiries', {
    method: 'POST',
    body: JSON.stringify(inquiry),
  })
  return { ...data, message: '咨询已提交，我们会尽快联系您' }
}

// ─── Utils ───

export function getAllCities(): string[] {
  // 城市列表直接从 mock 数据获取（变化不频繁）
  return mock.getAllCities()
}

export function getAllSpecialties(): string[] {
  return mock.getAllSpecialties()
}
