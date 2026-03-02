import { Link } from 'react-router-dom'
import { Home, Users, BookOpen } from 'lucide-react'
import PageHead from '@/components/seo/PageHead'

export default function NotFoundPage() {
  return (
    <div>
      <PageHead
        title="404 - 页面未找到 | TrainHub"
        description="您访问的页面不存在，请返回首页或浏览培训师、课程列表。"
        path="/404"
      />

      {/* 主体区域 */}
      <section className="flex min-h-[70vh] items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-lg text-center">
          {/* 大号 404 */}
          <p className="text-8xl font-extrabold text-blue-600 sm:text-9xl">404</p>

          {/* 标题与说明 */}
          <h1 className="mt-6 text-2xl font-bold text-gray-900 sm:text-3xl">
            页面未找到
          </h1>
          <p className="mt-3 text-gray-500">
            抱歉，您访问的页面不存在或已被移除。请检查地址是否正确，或通过以下入口继续浏览。
          </p>

          {/* 导航建议按钮 */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
            >
              <Home className="h-4 w-4" />
              返回首页
            </Link>
            <Link
              to="/trainers"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              <Users className="h-4 w-4" />
              浏览培训师
            </Link>
            <Link
              to="/courses"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              <BookOpen className="h-4 w-4" />
              浏览课程
            </Link>
          </div>

          {/* 搜索建议 */}
          <p className="mt-8 text-sm text-gray-400">
            您也可以使用首页的搜索功能，按关键词查找培训师或课程
          </p>
        </div>
      </section>
    </div>
  )
}
