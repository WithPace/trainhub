import { useState, useEffect, useCallback } from 'react'
import { List, ChevronUp } from 'lucide-react'

export interface TocItem {
  id: string
  text: string
  level: 2 | 3
}

interface TableOfContentsProps {
  items: TocItem[]
}

/**
 * 博客文章目录导航（桌面端侧边栏固定，移动端可折叠）
 * - 滚动追踪高亮当前章节
 * - 点击平滑滚动到目标位置
 */
export default function TableOfContents({ items }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('')
  const [mobileOpen, setMobileOpen] = useState(false)

  // 滚动追踪：用 IntersectionObserver 监听各标题进入视口
  useEffect(() => {
    if (items.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        // 找到最靠近顶部的可见标题
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)

        if (visible.length > 0) {
          setActiveId(visible[0].target.id)
        }
      },
      { rootMargin: '-80px 0px -70% 0px', threshold: 0 }
    )

    // 延迟观察，确保 DOM 已渲染
    const timer = setTimeout(() => {
      for (const item of items) {
        const el = document.getElementById(item.id)
        if (el) observer.observe(el)
      }
    }, 500)

    return () => {
      clearTimeout(timer)
      observer.disconnect()
    }
  }, [items])

  const handleClick = useCallback((id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setActiveId(id)
      setMobileOpen(false)
    }
  }, [])

  if (items.length < 3) return null

  return (
    <>
      {/* 桌面端：侧边栏内嵌 TOC */}
      <div className="hidden lg:block">
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <h3 className="flex items-center gap-2 text-sm font-bold text-gray-900">
            <List className="h-4 w-4 text-blue-600" />
            文章目录
          </h3>
          <nav className="mt-3 space-y-1">
            {items.map(item => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleClick(item.id)}
                className={`block w-full text-left text-xs leading-relaxed transition-colors ${
                  item.level === 3 ? 'pl-4' : ''
                } ${
                  activeId === item.id
                    ? 'font-semibold text-blue-600'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                <span className={`block truncate rounded-md px-2 py-1.5 ${
                  activeId === item.id ? 'bg-blue-50' : 'hover:bg-gray-50'
                }`}>
                  {item.text}
                </span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* 移动端：可折叠 TOC */}
      <div className="lg:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex w-full items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700"
        >
          <span className="flex items-center gap-2">
            <List className="h-4 w-4 text-blue-600" />
            文章目录（{items.length}节）
          </span>
          <ChevronUp className={`h-4 w-4 text-gray-400 transition-transform ${mobileOpen ? '' : 'rotate-180'}`} />
        </button>
        {mobileOpen && (
          <nav className="mt-1 space-y-0.5 rounded-lg border border-gray-200 bg-white p-3">
            {items.map(item => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleClick(item.id)}
                className={`block w-full text-left text-xs leading-relaxed ${
                  item.level === 3 ? 'pl-4' : ''
                } ${
                  activeId === item.id
                    ? 'font-semibold text-blue-600'
                    : 'text-gray-600'
                }`}
              >
                <span className={`block rounded-md px-2 py-1.5 ${
                  activeId === item.id ? 'bg-blue-50' : ''
                }`}>
                  {item.text}
                </span>
              </button>
            ))}
          </nav>
        )}
      </div>
    </>
  )
}
