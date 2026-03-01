import { GraduationCap } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* 品牌信息 */}
          <div>
            <div className="flex items-center gap-2">
              <GraduationCap className="h-6 w-6 text-blue-600" />
              <span className="text-lg font-bold text-gray-900">TrainHub</span>
            </div>
            <p className="mt-3 text-sm text-gray-500">
              连接企业与优质培训师的专业平台。
              帮助企业找到最合适的培训解决方案。
            </p>
          </div>

          {/* 快速链接 */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900">快速链接</h3>
            <ul className="mt-3 space-y-2">
              <li>
                <a href="/trainers" className="text-sm text-gray-500 hover:text-blue-600">
                  浏览培训师
                </a>
              </li>
              <li>
                <a href="/courses" className="text-sm text-gray-500 hover:text-blue-600">
                  浏览课程
                </a>
              </li>
              <li>
                <a href="/about" className="text-sm text-gray-500 hover:text-blue-600">
                  关于我们
                </a>
              </li>
            </ul>
          </div>

          {/* 联系方式 */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900">联系我们</h3>
            <ul className="mt-3 space-y-2 text-sm text-gray-500">
              <li>邮箱：contact@trainhub.cn</li>
              <li>电话：400-888-9999</li>
              <li>地址：上海市浦东新区</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-200 pt-8 text-center text-sm text-gray-400">
          &copy; {new Date().getFullYear()} TrainHub. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
