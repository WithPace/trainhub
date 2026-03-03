import { Link } from 'react-router-dom'
import { ArrowRight, FileText } from 'lucide-react'

/** 博客侧边栏工具包推广卡片（桌面端 sticky 区域） */
export default function SidebarToolkitCTA() {
  return (
    <div className="rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 p-5 text-white">
      <div className="flex items-center gap-2">
        <FileText className="h-4 w-4" />
        <h3 className="text-sm font-bold">培训决策工具包</h3>
      </div>
      <p className="mt-2 text-xs leading-relaxed text-amber-100">
        6 份专业模板，从需求分析到效果评估全覆盖，在线使用或打印
      </p>
      <Link
        to="/toolkit"
        className="mt-3 inline-flex items-center gap-1 rounded-lg bg-white px-4 py-2 text-xs font-medium text-amber-600 transition-colors hover:bg-amber-50"
      >
        免费使用 <ArrowRight className="h-3 w-3" />
      </Link>
    </div>
  )
}
