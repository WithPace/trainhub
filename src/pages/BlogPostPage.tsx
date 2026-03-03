import { useEffect, useState, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Calendar, Clock, User, ArrowLeft, ArrowRight, ChevronRight, ClipboardCheck, TrendingUp, BookOpen, DollarSign } from 'lucide-react'
import { getBlogPostMetaBySlug, getRelatedBlogPostsByKeywords, getPopularBlogPosts } from '@/data/blog-meta'
import RelatedBlogSection from '@/components/ui/RelatedBlogSection'
import ReadingProgressBar from '@/components/ui/ReadingProgressBar'
import TableOfContents, { type TocItem } from '@/components/ui/TableOfContents'
import PageHead from '@/components/seo/PageHead'
import type { ContentBlock } from '@/data/blog-meta'
import { getCourses } from '@/services/api'
import type { Course } from '@/types'
import { injectInternalLinks } from '@/lib/auto-link'
import ShareButtons from '@/components/ui/ShareButtons'
import BlogToolkitCTA from '@/components/ui/BlogToolkitCTA'

/** 解析文本中的 markdown 链接 [text](/url)，返回 React 节点 */
function renderTextWithLinks(text: string): React.ReactNode {
  const parts = text.split(/(\[[^\]]+\]\([^)]+\))/g)
  if (parts.length === 1) return text
  return parts.map((part, i) => {
    const match = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
    if (match) {
      const [, linkText, url] = match
      if (url.startsWith('/')) {
        return <Link key={i} to={url} className="text-blue-600 hover:underline">{linkText}</Link>
      }
      return <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{linkText}</a>
    }
    return part
  })
}

/** 生成标题锚点 ID */
function headingToId(text: string): string {
  return 'h-' + text.replace(/[^\u4e00-\u9fa5\w]+/g, '-').replace(/^-|-$/g, '').toLowerCase()
}

/** 从内容块中提取 TOC 条目 */
export function extractTocItems(blocks: ContentBlock[]): TocItem[] {
  return blocks
    .filter(b => b.type === 'heading2' || b.type === 'heading3')
    .map(b => ({
      id: headingToId(b.text),
      text: b.text,
      level: b.type === 'heading2' ? 2 : 3,
    }))
}

/** 渲染内容块 */
function renderContentBlock(block: ContentBlock, index: number) {
  switch (block.type) {
    case 'heading2':
      return (
        <h2 key={index} id={headingToId(block.text)} className="mt-10 mb-4 scroll-mt-24 text-xl font-bold text-gray-900 sm:text-2xl">
          {block.text}
        </h2>
      )
    case 'heading3':
      return (
        <h3 key={index} id={headingToId(block.text)} className="mt-8 mb-3 scroll-mt-24 text-lg font-semibold text-gray-900">
          {block.text}
        </h3>
      )
    case 'paragraph':
      return (
        <p key={index} className="mb-5 leading-relaxed text-gray-700">
          {renderTextWithLinks(block.text)}
        </p>
      )
    case 'list':
      return (
        <ul key={index} className="mb-5 space-y-2 pl-5">
          {block.text.split('\n').map((item, i) => (
            <li key={i} className="list-disc leading-relaxed text-gray-700">
              {renderTextWithLinks(item)}
            </li>
          ))}
        </ul>
      )
    case 'quote':
      return (
        <blockquote
          key={index}
          className="mb-5 border-l-4 border-blue-500 bg-blue-50 py-3 pl-4 pr-4 italic text-gray-700"
        >
          {renderTextWithLinks(block.text)}
        </blockquote>
      )
    case 'table': {
      const rows = block.text.split('\n')
      const headers = rows[0]?.split('|') ?? []
      const dataRows = rows.slice(1)
      return (
        <div key={index} className="mb-5 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b-2 border-gray-200 bg-gray-50">
                {headers.map((header, i) => (
                  <th key={i} className="px-4 py-3 text-left font-semibold text-gray-900">
                    {header.trim()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dataRows.map((row, rowIndex) => (
                <tr key={rowIndex} className="border-b border-gray-100">
                  {row.split('|').map((cell, cellIndex) => (
                    <td key={cellIndex} className="px-4 py-3 text-gray-700">
                      {cell.trim()}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    }
    default:
      return null
  }
}

/** 文章正文加载骨架屏 */
function ContentSkeleton() {
  return (
    <div className="mt-8 animate-pulse space-y-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <div className={`h-4 rounded bg-gray-200 ${i % 3 === 0 ? 'w-3/4' : 'w-full'}`} />
          <div className="h-4 w-5/6 rounded bg-gray-200" />
        </div>
      ))}
    </div>
  )
}

/** 价格区间格式化 */
function formatPriceRange(range: string): string {
  const parts = range.split('-')
  if (parts.length !== 2) return range
  const low = Math.round(parseInt(parts[0]) / 10000)
  const high = Math.round(parseInt(parts[1]) / 10000)
  if (low === high) return `${low}万`
  return `${low}-${high}万`
}

/** 文章内嵌课程推荐 CTA — 在文章中间转化读者 */
function InlineCoursesCTA({ courses }: { courses: Course[] }) {
  if (courses.length === 0) return null
  return (
    <div className="my-8 rounded-xl border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-5 sm:p-6">
      <p className="flex items-center gap-2 text-sm font-bold text-blue-900">
        <BookOpen className="h-4 w-4" />
        相关课程推荐
      </p>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {courses.map(course => (
          <Link
            key={course.id}
            to={`/courses/${course.id}`}
            className="group rounded-lg border border-blue-100 bg-white p-4 transition-shadow hover:shadow-md"
          >
            <p className="line-clamp-1 text-sm font-semibold text-gray-900 group-hover:text-blue-600">
              {course.title}
            </p>
            {course.trainer_name && (
              <p className="mt-1 text-xs text-gray-500">讲师：{course.trainer_name}</p>
            )}
            <div className="mt-2 flex items-center gap-3 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" /> {course.duration}
              </span>
              <span className="flex items-center gap-1 font-medium text-blue-600">
                <DollarSign className="h-3 w-3" />
                {formatPriceRange(course.price_range)}
              </span>
            </div>
          </Link>
        ))}
      </div>
      <Link
        to="/courses"
        className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-800"
      >
        查看全部课程 <ArrowRight className="h-3 w-3" />
      </Link>
    </div>
  )
}

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>()
  const meta = slug ? getBlogPostMetaBySlug(slug) : undefined
  // 基于标签的加权匹配推荐（比同分类匹配更精准）
  const relatedPosts = meta ? getRelatedBlogPostsByKeywords(meta.tags, 3, meta.id) : []
  // 热门文章（侧边栏，排除当前文章）
  const popularPosts = meta ? getPopularBlogPosts(5, meta.id) : []

  // 文章正文按需加载（每篇文章独立 chunk，~8-21KB，替代旧的 540KB 全量加载）
  const [content, setContent] = useState<ContentBlock[] | null>(null)
  const [relatedCourses, setRelatedCourses] = useState<Course[]>([])

  // 提取 TOC 条目
  const tocItems = useMemo(() => content ? extractTocItems(content) : [], [content])

  // 加载与文章主题相关的课程（用于文章内嵌 CTA）
  useEffect(() => {
    if (!meta) return
    getCourses().then(courses => {
      const lowerTags = meta.tags.map(t => t.toLowerCase())
      const matched = courses.filter(c =>
        lowerTags.some(tag =>
          c.category_name?.toLowerCase().includes(tag) ||
          tag.includes(c.category_name?.toLowerCase() ?? '') ||
          c.title.toLowerCase().includes(tag)
        )
      ).slice(0, 2)
      setRelatedCourses(matched)
    })
  }, [meta])

  useEffect(() => {
    if (!slug) return
    setContent(null) // 切换文章时重置
    import('@/data/blog-loader').then(({ loadBlogPost }) =>
      loadBlogPost(slug).then(post => {
        if (post) setContent(post.content)
      })
    )
  }, [slug])

  // 设置 JSON-LD
  useEffect(() => {
    if (!meta) return

    // 计算中文 wordCount：所有 content block 的 text 总字符数（去掉空格和换行）
    const wordCount = content
      ? content.reduce((sum, block) => sum + block.text.replace(/[\s\n]/g, '').length, 0)
      : undefined

    // JSON-LD: Article schema
    const jsonLd: Record<string, unknown> = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: meta.title,
      description: meta.excerpt,
      image: {
        '@type': 'ImageObject',
        url: `https://withpace.github.io/trainhub/og/blog/${meta.id}.webp`,
        width: 1200,
        height: 630,
      },
      author: {
        '@type': 'Person',
        name: meta.author,
      },
      publisher: {
        '@type': 'Organization',
        name: 'TrainHub',
        url: 'https://withpace.github.io/trainhub/',
        logo: {
          '@type': 'ImageObject',
          url: 'https://withpace.github.io/trainhub/og-image.webp',
          width: 1200,
          height: 630,
        },
      },
      datePublished: meta.publishDate,
      dateModified: meta.publishDate,
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `https://withpace.github.io/trainhub/blog/${meta.id}`,
      },
      articleSection: meta.category,
      keywords: meta.tags.join(', '),
    }

    if (wordCount !== undefined) {
      jsonLd.wordCount = wordCount
    }

    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.textContent = JSON.stringify(jsonLd)
    script.id = 'blog-post-jsonld'
    document.head.appendChild(script)

    // 滚动到页面顶部
    window.scrollTo(0, 0)

    return () => {
      const existing = document.getElementById('blog-post-jsonld')
      if (existing) existing.remove()
    }
  }, [meta, content])

  // 文章未找到
  if (!meta) {
    return (
      <div className="px-4 py-20 text-center">
        <h2 className="text-xl font-semibold text-gray-900">文章未找到</h2>
        <Link to="/blog" className="mt-4 inline-block text-blue-600 hover:underline">
          返回行业洞察
        </Link>
      </div>
    )
  }

  return (
    <div>
      <ReadingProgressBar />
      <PageHead
        title={`${meta.title} - TrainHub 行业洞察`}
        description={meta.excerpt}
        path={`/blog/${meta.id}`}
        ogImage={`https://withpace.github.io/trainhub/og/blog/${meta.id}.webp`}
        type="article"
        publishDate={meta.publishDate}
      />
      {/* 面包屑导航 */}
      <div className="border-b border-gray-200 bg-gray-50 px-4 sm:px-6 lg:px-8">
        <nav className="mx-auto flex max-w-4xl items-center gap-2 py-3 text-sm text-gray-500">
          <Link to="/" className="hover:text-blue-600">
            首页
          </Link>
          <ChevronRight className="h-3 w-3" />
          <Link to="/blog" className="hover:text-blue-600">
            行业洞察
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="line-clamp-1 text-gray-900">{meta.title}</span>
        </nav>
      </div>

      {/* 文章内容 + 侧边栏 */}
      <div className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-6xl gap-8">
          {/* 主内容区 */}
          <article className="min-w-0 flex-1">
            <div className="mx-auto max-w-3xl">
              {/* 文章头部 */}
              <header>
                {/* 分类标签 */}
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
                  {meta.category}
                </span>

                {/* 标题 */}
                <h1 className="mt-4 text-2xl font-bold leading-tight text-gray-900 sm:text-3xl">
                  {meta.title}
                </h1>

                {/* 元信息栏 */}
                <div className="mt-5 flex flex-wrap items-center gap-4 border-b border-gray-200 pb-6 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {meta.author}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {meta.publishDate}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {meta.readTime}
                  </span>
                </div>

                {/* 标签 + 分享按钮 */}
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap gap-2">
                    {meta.tags.map(tag => (
                      <span
                        key={tag}
                        className="rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-600"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <ShareButtons title={meta.title} />
                </div>
              </header>

              {/* 移动端 TOC — 折叠式目录 */}
              {tocItems.length >= 3 && (
                <div className="mt-6">
                  <TableOfContents items={tocItems} />
                </div>
              )}

              {/* 文章正文 — 按需加载，自动内链 + 中间插入课程推荐 CTA */}
              {content ? (
                <div className="mt-8">
                  {(() => {
                    const mid = Math.floor(content.length / 2)
                    // 跨段落去重：每个 URL 只链接一次
                    const linked = new Set<string>()
                    const renderWithAutoLink = (block: ContentBlock, index: number) => {
                      // 仅对 paragraph 和 list 类型注入内链
                      if (block.type === 'paragraph' || block.type === 'list') {
                        const enrichedText = injectInternalLinks(block.text, linked)
                        return renderContentBlock({ ...block, text: enrichedText }, index)
                      }
                      return renderContentBlock(block, index)
                    }
                    return (
                      <>
                        {content.slice(0, mid).map((block, i) => renderWithAutoLink(block, i))}
                        {relatedCourses.length > 0 && <InlineCoursesCTA courses={relatedCourses} />}
                        {content.slice(mid).map((block, i) => renderWithAutoLink(block, mid + i))}
                      </>
                    )
                  })()}
                </div>
              ) : (
                <ContentSkeleton />
              )}

              {/* 工具包推广 CTA — 文章读完后引导转化 */}
              {content && <BlogToolkitCTA category={meta.category} />}

              {/* 文章底部分享栏 */}
              {content && (
                <div className="mt-10 flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-5 py-4">
                  <p className="text-sm font-medium text-gray-700">觉得有价值？分享给同行</p>
                  <ShareButtons title={meta.title} />
                </div>
              )}
            </div>
          </article>

          {/* 侧边栏 — 桌面端显示 */}
          <aside className="hidden w-72 shrink-0 lg:block">
            <div className="sticky top-6 space-y-6">
              {/* 文章目录 */}
              {tocItems.length >= 3 && <TableOfContents items={tocItems} />}

              {/* 热门文章 */}
              <div className="rounded-xl border border-gray-200 bg-white p-5">
                <h3 className="flex items-center gap-2 text-sm font-bold text-gray-900">
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                  热门文章
                </h3>
                <div className="mt-4 space-y-4">
                  {popularPosts.map((post, index) => (
                    <Link
                      key={post.id}
                      to={`/blog/${post.id}`}
                      className="group flex gap-3"
                    >
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-gray-500 group-hover:bg-blue-100 group-hover:text-blue-600">
                        {index + 1}
                      </span>
                      <div className="min-w-0">
                        <p className="line-clamp-2 text-sm leading-snug text-gray-700 group-hover:text-blue-600">
                          {post.title}
                        </p>
                        <p className="mt-1 text-xs text-gray-400">{post.readTime}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* 需求诊断 CTA */}
              <div className="rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 p-5 text-white">
                <h3 className="text-sm font-bold">不确定需要什么培训？</h3>
                <p className="mt-2 text-xs leading-relaxed text-blue-200">
                  3分钟诊断企业培训需求，获取专属方案
                </p>
                <Link
                  to="/assessment"
                  className="mt-3 inline-flex items-center gap-1 rounded-lg bg-white px-4 py-2 text-xs font-medium text-blue-600 transition-colors hover:bg-blue-50"
                >
                  开始诊断 <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* 需求诊断 CTA — 文章读完后引导转化 */}
      <section className="border-t border-gray-200 bg-gradient-to-r from-amber-50 to-orange-50 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 sm:flex-row sm:items-start sm:gap-6">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-amber-100">
            <ClipboardCheck className="h-7 w-7 text-amber-600" />
          </div>
          <div className="text-center sm:text-left">
            <h3 className="text-lg font-bold text-gray-900">
              不确定企业需要什么培训？
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              3 分钟完成培训需求诊断，获取个性化培训建议和推荐方案
            </p>
            <Link
              to="/assessment"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-amber-600"
            >
              免费诊断培训需求
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 相关文章推荐（基于标签加权匹配） */}
      {relatedPosts.length > 0 && (
        <section className="border-t border-gray-200 bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <RelatedBlogSection posts={relatedPosts} title="推荐阅读" />
          </div>
        </section>
      )}

      {/* 底部 CTA */}
      <section className="bg-blue-600 px-4 py-12 text-center text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-xl font-bold sm:text-2xl">
            找到最适合企业的培训师和课程
          </h2>
          <p className="mt-3 text-blue-100">
            TrainHub 上的每一位培训师都经过严格筛选，信息真实透明
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/trainers"
              className="rounded-lg bg-white px-6 py-3 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-50"
            >
              浏览培训师
            </Link>
            <Link
              to="/courses"
              className="rounded-lg border border-white/30 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10"
            >
              浏览课程
            </Link>
          </div>
        </div>
      </section>

      {/* 返回按钮 */}
      <div className="border-t border-gray-200 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <Link
            to="/blog"
            className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600"
          >
            <ArrowLeft className="h-4 w-4" />
            返回行业洞察
          </Link>
        </div>
      </div>
    </div>
  )
}
