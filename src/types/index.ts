export interface Category {
  id: number
  name: string
  slug: string
  icon: string
  description: string
}

export interface Trainer {
  id: number
  name: string
  title: string
  bio: string
  avatar_url: string | null
  years_experience: number
  specialties: string[]
  city: string
  rating: number
  review_count: number
  contact_email: string
  contact_phone: string | null
  wechat_id: string | null
  featured: boolean
  status: string
  created_at: string
  updated_at: string
  // Joined fields
  courses?: Course[]
}

export interface Course {
  id: number
  trainer_id: number
  title: string
  description: string
  outline: string[]
  duration: string
  target_audience: string
  max_participants: number
  price_range: string
  category_id: number
  featured: boolean
  status: string
  created_at: string
  updated_at: string
  // Joined fields
  trainer_name?: string
  trainer_title?: string
  trainer_avatar?: string
  category_name?: string
  category_slug?: string
}

export interface Review {
  id: number
  trainer_id: number
  course_id?: number
  author: string
  company: string
  role: string
  rating: number
  content: string
  date: string
}

export interface Inquiry {
  course_id?: number
  trainer_id?: number
  company_name: string
  contact_name: string
  contact_email?: string
  contact_phone: string
  message?: string
}
