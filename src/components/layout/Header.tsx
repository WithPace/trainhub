import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, GraduationCap } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { label: '首页', path: '/' },
  { label: '需求诊断', path: '/assessment' },
  { label: '智能匹配', path: '/match' },
  { label: '培训师', path: '/trainers' },
  { label: '课程', path: '/courses' },
  { label: '行业洞察', path: '/blog' },
  { label: '培训师入驻', path: '/join' },
  { label: '关于我们', path: '/about' },
]

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()

  // 判断导航项是否激活（首页精确匹配，其他前缀匹配）
  const isActive = (path: string) =>
    path === '/'
      ? location.pathname === '/'
      : location.pathname === path || location.pathname.startsWith(path + '/')

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <GraduationCap className="h-8 w-8 text-blue-600" />
          <span className="text-xl font-bold text-gray-900">TrainHub</span>
        </Link>

        {/* 桌面端导航 */}
        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'text-sm font-medium transition-colors hover:text-blue-600',
                isActive(item.path)
                  ? 'text-blue-600'
                  : 'text-gray-600'
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* 咨询按钮（桌面端） */}
        <Link
          to="/about"
          className="hidden rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 md:block"
        >
          免费咨询
        </Link>

        {/* 移动端菜单按钮 */}
        <button
          type="button"
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6 text-gray-600" />
          ) : (
            <Menu className="h-6 w-6 text-gray-600" />
          )}
        </button>
      </div>

      {/* 移动端菜单 */}
      {mobileMenuOpen && (
        <div className="border-t border-gray-200 bg-white md:hidden">
          <nav className="flex flex-col px-4 py-3">
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive(item.path)
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/about"
              className="mt-2 rounded-lg bg-blue-600 px-3 py-2 text-center text-sm font-medium text-white"
              onClick={() => setMobileMenuOpen(false)}
            >
              免费咨询
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
