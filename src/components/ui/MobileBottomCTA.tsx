import { Link, useLocation } from 'react-router-dom'
import { ClipboardCheck, MessageCircle } from 'lucide-react'

/**
 * 移动端底部固定 CTA 栏
 * - 仅在 <lg 屏幕显示
 * - 包含"免费诊断"和"在线咨询"两个核心转化入口
 * - 在自评页面和匹配结果页隐藏（避免重复 CTA）
 */
const HIDDEN_PATHS = ['/assessment', '/match']

export default function MobileBottomCTA() {
  const { pathname } = useLocation()

  // 在特定页面隐藏
  if (HIDDEN_PATHS.some(p => pathname.startsWith(p))) return null

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white/95 px-4 py-2.5 backdrop-blur-sm lg:hidden">
      <div className="flex gap-3">
        <Link
          to="/assessment"
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-amber-500 py-2.5 text-sm font-medium text-white transition-colors active:bg-amber-600"
        >
          <ClipboardCheck className="h-4 w-4" />
          免费诊断
        </Link>
        <a
          href="tel:+8613800001111"
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-blue-600 py-2.5 text-sm font-medium text-white transition-colors active:bg-blue-700"
        >
          <MessageCircle className="h-4 w-4" />
          在线咨询
        </a>
      </div>
    </div>
  )
}
