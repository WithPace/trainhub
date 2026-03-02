import type { Trainer, Course } from '@/types'

const BASE_URL = 'https://withpace.github.io/trainhub'

// ---- 通用 JSON-LD 渲染组件 ----

interface JsonLdProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any>
}

/** 通用结构化数据组件，将 JSON-LD 注入页面 head */
export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

// ---- Schema 构建函数 ----

/** 构建培训师 Person 结构化数据 */
export function buildPersonSchema(trainer: Trainer) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: trainer.name,
    jobTitle: trainer.title,
    description: trainer.bio,
    address: {
      '@type': 'PostalAddress',
      addressLocality: trainer.city,
    },
    knowsAbout: trainer.specialties,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: String(trainer.rating),
      reviewCount: String(trainer.review_count),
    },
  }
}

/** 构建课程 Course 结构化数据 */
export function buildCourseSchema(course: Course, trainer?: Trainer | null) {
  const [lowPrice, highPrice] = course.price_range.split('-')

  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: course.title,
    description: course.description,
    provider: {
      '@type': 'Person',
      name: trainer?.name ?? course.trainer_name ?? '',
    },
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'onsite',
      duration: course.duration,
      maximumAttendeeCapacity: course.max_participants,
    },
    offers: {
      '@type': 'AggregateOffer',
      lowPrice: lowPrice,
      highPrice: highPrice,
      priceCurrency: 'CNY',
    },
    about: {
      '@type': 'Thing',
      name: course.category_name ?? '',
    },
    audience: {
      '@type': 'Audience',
      audienceType: course.target_audience,
    },
  }
}

/** 面包屑项定义 */
export interface BreadcrumbItem {
  name: string
  url?: string
}

/** 构建面包屑 BreadcrumbList 结构化数据 */
export function buildBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const element: Record<string, any> = {
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
      }
      // 最后一项（当前页面）不需要 item URL
      if (item.url) {
        element.item = item.url
      }
      return element
    }),
  }
}

// ---- 面包屑可视组件 ----

interface BreadcrumbNavProps {
  items: BreadcrumbItem[]
}

/** 可视面包屑导航，替代"返回 xxx 列表"的链接 */
export function BreadcrumbNav({ items }: BreadcrumbNavProps) {
  return (
    <nav aria-label="面包屑导航" className="text-sm text-gray-500">
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          return (
            <li key={index} className="flex items-center gap-1">
              {index > 0 && <span className="text-gray-400">&gt;</span>}
              {isLast || !item.url ? (
                <span className="text-gray-700 font-medium">{item.name}</span>
              ) : (
                <a
                  href={item.url}
                  className="text-blue-600 hover:text-blue-800 hover:underline"
                >
                  {item.name}
                </a>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

/** 生成培训师页面的面包屑数据 */
export function trainerBreadcrumbs(trainerName: string): BreadcrumbItem[] {
  return [
    { name: '首页', url: `${BASE_URL}/` },
    { name: '培训师', url: `${BASE_URL}/trainers` },
    { name: trainerName },
  ]
}

/** 生成课程页面的面包屑数据 */
export function courseBreadcrumbs(courseTitle: string): BreadcrumbItem[] {
  return [
    { name: '首页', url: `${BASE_URL}/` },
    { name: '课程', url: `${BASE_URL}/courses` },
    { name: courseTitle },
  ]
}
