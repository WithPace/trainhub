import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  ChevronRight, ArrowLeft, Printer,
  ClipboardList, FileText, BarChart3, Calculator, FileSearch, TrendingUp,
  Lightbulb, ArrowRight, CheckSquare, Square,
} from 'lucide-react'
import PageHead from '@/components/seo/PageHead'
import { JsonLd } from '@/components/seo/JsonLd'
import ToolkitEmailForm from '@/components/ui/ToolkitEmailForm'
import { getToolkitTemplateById } from '@/data/toolkit-templates'
import type { ToolkitTemplate, ToolkitSection } from '@/data/toolkit-templates'
import { getBlogPostMetaBySlug } from '@/data/blog-meta'

/** Lucide 图标字符串 -> 组件映射 */
const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  'clipboard-list': ClipboardList,
  'file-text': FileText,
  'bar-chart-3': BarChart3,
  'calculator': Calculator,
  'file-search': FileSearch,
  'trending-up': TrendingUp,
}

const BASE_URL = 'https://withpace.github.io/trainhub'

// ---- Section 渲染组件 ----

/** 表格区块：表头高亮、交替行色、响应式横向滚动 */
function TableSection({ section }: { section: ToolkitSection }) {
  if (section.type !== 'table' || !section.headers || !section.rows) return null
  return (
    <div className="my-8">
      <h2 className="mb-4 text-xl font-bold text-gray-900">{section.title}</h2>
      {section.description && (
        <p className="mb-4 text-sm text-gray-500">{section.description}</p>
      )}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-blue-600 text-white">
              {section.headers.map((header, i) => (
                <th key={i} className="whitespace-nowrap px-4 py-3 text-left font-semibold">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {section.rows.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
              >
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} className="px-4 py-3 text-gray-700">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

/** 清单区块：可勾选的复选框列表 */
function ChecklistSection({
  section,
  checked,
  onToggle,
}: {
  section: ToolkitSection
  checked: Record<string, boolean>
  onToggle: (key: string) => void
}) {
  if (section.type !== 'checklist' || !section.items) return null
  return (
    <div className="my-8">
      <h2 className="mb-4 text-xl font-bold text-gray-900">{section.title}</h2>
      {section.description && (
        <p className="mb-4 text-sm text-gray-500">{section.description}</p>
      )}
      <ul className="space-y-2">
        {section.items.map((item, i) => {
          const key = `${section.title}-${i}`
          const isChecked = !!checked[key]
          return (
            <li key={i}>
              <button
                type="button"
                onClick={() => onToggle(key)}
                className="flex w-full items-start gap-3 rounded-lg px-3 py-2 text-left transition-colors hover:bg-gray-50"
              >
                {isChecked ? (
                  <CheckSquare className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
                ) : (
                  <Square className="mt-0.5 h-5 w-5 shrink-0 text-gray-400" />
                )}
                <span className={isChecked ? 'text-gray-400 line-through' : 'text-gray-700'}>
                  {item}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
      {section.items.length > 0 && (
        <p className="mt-3 text-xs text-gray-400">
          已完成 {Object.values(checked).filter(Boolean).length} / {section.items.length} 项
        </p>
      )}
    </div>
  )
}

/** 文本段落区块 */
function TextSection({ section }: { section: ToolkitSection }) {
  if (section.type !== 'text' || !section.paragraphs) return null
  return (
    <div className="my-8">
      <h2 className="mb-4 text-xl font-bold text-gray-900">{section.title}</h2>
      {section.description && (
        <p className="mb-3 text-sm text-gray-500">{section.description}</p>
      )}
      {section.paragraphs.map((paragraph, i) => (
        <p key={i} className="mb-4 leading-relaxed text-gray-700">
          {paragraph}
        </p>
      ))}
    </div>
  )
}

/** 表单字段区块：可填写的输入字段（纯前端） */
function FormFieldsSection({
  section,
  values,
  onChange,
}: {
  section: ToolkitSection
  values: Record<string, string>
  onChange: (key: string, value: string) => void
}) {
  if (section.type !== 'form-fields' || !section.fields) return null
  return (
    <div className="my-8">
      <h2 className="mb-4 text-xl font-bold text-gray-900">{section.title}</h2>
      {section.description && (
        <p className="mb-4 text-sm text-gray-500">{section.description}</p>
      )}
      <div className="space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-5">
        {section.fields.map((field, i) => {
          const key = `${section.title}-${i}`
          return (
            <div key={i}>
              <label className="mb-1.5 block text-sm font-medium text-gray-900">
                {field.label}
                {field.required && <span className="ml-1 text-red-500">*</span>}
              </label>
              {field.type === 'textarea' ? (
                <textarea
                  rows={3}
                  placeholder={field.placeholder}
                  value={values[key] ?? ''}
                  onChange={(e) => onChange(key, e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              ) : field.type === 'select' && field.options ? (
                <select
                  value={values[key] ?? ''}
                  onChange={(e) => onChange(key, e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">{field.placeholder ?? '请选择'}</option>
                  {field.options.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type ?? 'text'}
                  placeholder={field.placeholder}
                  value={values[key] ?? ''}
                  onChange={(e) => onChange(key, e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ---- 主页面 ----

export default function ToolkitTemplatePage() {
  const { slug } = useParams<{ slug: string }>()
  const template: ToolkitTemplate | undefined = slug
    ? getToolkitTemplateById(slug)
    : undefined

  // 清单勾选状态
  const [checked, setChecked] = useState<Record<string, boolean>>({})
  // 表单字段值
  const [formValues, setFormValues] = useState<Record<string, string>>({})

  const toggleCheck = (key: string) => {
    setChecked((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const handleFormChange = (key: string, value: string) => {
    setFormValues((prev) => ({ ...prev, [key]: value }))
  }

  // 切换模板时重置状态并滚动到顶部
  useEffect(() => {
    setChecked({})
    setFormValues({})
    window.scrollTo(0, 0)
  }, [slug])

  // 解析图标
  const IconComponent = template ? ICON_MAP[template.icon] : undefined

  // 获取关联博客文章元数据
  const relatedBlogPosts = template?.relatedBlogSlugs
    ?.map((s) => getBlogPostMetaBySlug(s))
    .filter(Boolean) ?? []

  // ---- 404 ----
  if (!template) {
    return (
      <div className="px-4 py-20 text-center">
        <h2 className="text-xl font-semibold text-gray-900">模板未找到</h2>
        <p className="mt-2 text-sm text-gray-500">
          你访问的工具包模板不存在或已被移除
        </p>
        <Link
          to="/toolkit"
          className="mt-6 inline-flex items-center gap-1 text-blue-600 hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          返回工具包总览
        </Link>
      </div>
    )
  }

  return (
    <>
      <PageHead
        title={`${template.title} - 企业培训工具包 | TrainHub`}
        description={template.subtitle}
        path={`/toolkit/${template.id}`}
        ogImage={`${BASE_URL}/og/toolkit/${template.id}.webp`}
        type="article"
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: template.title,
          description: template.subtitle,
          author: {
            '@type': 'Organization',
            name: 'TrainHub',
          },
          publisher: {
            '@type': 'Organization',
            name: 'TrainHub',
            url: `${BASE_URL}/`,
          },
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `${BASE_URL}/toolkit/${template.id}`,
          },
        }}
      />

      {/* 打印按钮 — 固定在右上角 */}
      <button
        type="button"
        onClick={() => window.print()}
        className="print:hidden fixed right-6 top-20 z-40 flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-lg ring-1 ring-gray-200 transition-colors hover:bg-gray-50"
      >
        <Printer className="h-4 w-4" />
        打印 / 导出 PDF
      </button>

      {/* 面包屑导航 */}
      <div className="print:hidden border-b border-gray-200 bg-gray-50 px-4 sm:px-6 lg:px-8">
        <nav className="mx-auto flex max-w-4xl items-center gap-2 py-3 text-sm text-gray-500">
          <Link to="/" className="hover:text-blue-600">首页</Link>
          <ChevronRight className="h-3 w-3" />
          <Link to="/toolkit" className="hover:text-blue-600">工具包</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="line-clamp-1 text-gray-900">{template.title}</span>
        </nav>
      </div>

      {/* Hero 区域 */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:py-16 lg:px-8">
          <div className="flex items-start gap-5">
            {IconComponent && (
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
                <IconComponent className="h-7 w-7" />
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
                {template.title}
              </h1>
              <p className="mt-3 max-w-2xl text-lg text-blue-100">
                {template.subtitle}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 主内容区 */}
      <div className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">

          {/* 各个 Section */}
          {template.sections.map((section, index) => {
            switch (section.type) {
              case 'table':
                return <TableSection key={index} section={section} />
              case 'checklist':
                return (
                  <ChecklistSection
                    key={index}
                    section={section}
                    checked={checked}
                    onToggle={toggleCheck}
                  />
                )
              case 'text':
                return <TextSection key={index} section={section} />
              case 'form-fields':
                return (
                  <FormFieldsSection
                    key={index}
                    section={section}
                    values={formValues}
                    onChange={handleFormChange}
                  />
                )
              default:
                return null
            }
          })}

          {/* 使用建议 */}
          {template.tips && template.tips.length > 0 && (
            <div className="my-10 rounded-xl border border-amber-200 bg-amber-50 p-6">
              <h2 className="flex items-center gap-2 text-lg font-bold text-amber-900">
                <Lightbulb className="h-5 w-5" />
                使用建议
              </h2>
              <ul className="mt-4 space-y-3">
                {template.tips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-amber-800">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-200 text-xs font-bold text-amber-900">
                      {i + 1}
                    </span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 相关文章 */}
          {relatedBlogPosts.length > 0 && (
            <div className="my-10">
              <h2 className="mb-4 text-xl font-bold text-gray-900">相关文章</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {relatedBlogPosts.map((post) =>
                  post ? (
                    <Link
                      key={post.id}
                      to={`/blog/${post.id}`}
                      className="group rounded-xl border border-gray-200 p-5 transition-shadow hover:shadow-md"
                    >
                      <span className="text-xs font-medium text-blue-600">
                        {post.category}
                      </span>
                      <h3 className="mt-2 line-clamp-2 text-sm font-semibold text-gray-900 group-hover:text-blue-600">
                        {post.title}
                      </h3>
                      <p className="mt-1 line-clamp-2 text-xs text-gray-500">
                        {post.excerpt}
                      </p>
                    </Link>
                  ) : null
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 底部邮箱收集 CTA */}
      <section className="print:hidden bg-gradient-to-br from-blue-600 to-indigo-700 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-xl text-center">
          <ToolkitEmailForm source={`toolkit-template-${slug}`} compact />
        </div>
      </section>

      {/* 返回按钮 */}
      <div className="print:hidden border-t border-gray-200 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <Link
            to="/toolkit"
            className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600"
          >
            <ArrowLeft className="h-4 w-4" />
            返回工具包总览
          </Link>
        </div>
      </div>

      {/* 打印样式 */}
      <style>{`
        @media print {
          nav, .print\\:hidden { display: none !important; }
          body { font-size: 12pt; }
          section[class*="bg-gradient"] { background: white !important; color: black !important; }
          section[class*="bg-gradient"] h1 { color: #111827 !important; }
          section[class*="bg-gradient"] p { color: #4b5563 !important; }
          button { display: none !important; }
        }
      `}</style>
    </>
  )
}
