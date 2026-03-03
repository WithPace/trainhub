import { useEffect } from 'react'

const BASE_URL = 'https://withpace.github.io/trainhub'

/** 首页默认 SEO 元信息 */
const DEFAULTS = {
  title: 'TrainHub - 找到最适合企业的培训师',
  description:
    'TrainHub 连接企业与顶尖培训师，覆盖领导力、销售、数字化转型等核心领域，一站式解决企业培训需求。',
  url: BASE_URL,
  image: `${BASE_URL}/og-image.png`,
  type: 'website' as const,
}

interface PageHeadProps {
  /** 页面标题 */
  title: string
  /** 页面描述 */
  description: string
  /** 路径，如 '/blog/xxx' */
  path: string
  /** og:image URL（可选，默认使用站点封面图） */
  ogImage?: string
  /** og:type（可选，默认 website） */
  type?: 'website' | 'article'
  /** 文章发布日期（仅 type 为 article 时生效） */
  publishDate?: string
}

/** 设置或更新某个 meta 标签 */
function setMeta(property: string, content: string) {
  // 同时支持 property 和 name 选择器
  const selector = property.startsWith('twitter:')
    ? `meta[name="${property}"]`
    : `meta[property="${property}"]`
  let el = document.querySelector(selector) as HTMLMetaElement | null

  if (!el) {
    el = document.createElement('meta')
    if (property.startsWith('twitter:')) {
      el.setAttribute('name', property)
    } else {
      el.setAttribute('property', property)
    }
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

/** 设置或更新 canonical link */
function setCanonical(url: string) {
  let el = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', 'canonical')
    document.head.appendChild(el)
  }
  el.setAttribute('href', url)
}

/**
 * SEO Head 管理组件
 *
 * 在每个页面挂载时更新 document.title、canonical、Open Graph 和 Twitter Card 元标签。
 * 组件卸载时自动还原为首页默认值。
 */
export default function PageHead({
  title,
  description,
  path,
  ogImage,
  type = 'website',
  publishDate,
}: PageHeadProps) {
  useEffect(() => {
    const fullUrl = `${BASE_URL}${path}`
    const image = ogImage ?? DEFAULTS.image

    // 更新页面标题
    document.title = title

    // 更新 canonical
    setCanonical(fullUrl)

    // Open Graph
    setMeta('og:title', title)
    setMeta('og:description', description)
    setMeta('og:url', fullUrl)
    setMeta('og:image', image)
    setMeta('og:type', type)
    if (type === 'article' && publishDate) {
      setMeta('article:published_time', publishDate)
    }

    // Twitter Card
    setMeta('twitter:card', 'summary_large_image')
    setMeta('twitter:title', title)
    setMeta('twitter:description', description)
    setMeta('twitter:image', image)

    // 卸载时还原为首页默认值
    return () => {
      document.title = DEFAULTS.title
      setCanonical(DEFAULTS.url)
      setMeta('og:title', DEFAULTS.title)
      setMeta('og:description', DEFAULTS.description)
      setMeta('og:url', DEFAULTS.url)
      setMeta('og:image', DEFAULTS.image)
      setMeta('og:type', DEFAULTS.type)
      setMeta('twitter:card', 'summary_large_image')
      setMeta('twitter:title', DEFAULTS.title)
      setMeta('twitter:description', DEFAULTS.description)
      setMeta('twitter:image', DEFAULTS.image)
    }
  }, [title, description, path, ogImage, type, publishDate])

  // 纯副作用组件，不渲染 DOM
  return null
}
