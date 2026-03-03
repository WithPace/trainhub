import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  Download, Mail, CheckCircle, ClipboardList, TrendingUp,
} from 'lucide-react'

/** FormSubmit.co 表单提交地址（无需后端，邮件直达） */
const FORMSUBMIT_URL = 'https://formsubmit.co/ajax/trainhub.toolkit@gmail.com'

interface ToolkitEmailFormProps {
  /** 提交来源标识，用于区分不同页面 */
  source: string
  /** 是否使用紧凑模式（模板详情页底部使用） */
  compact?: boolean
}

/**
 * 工具包邮箱收集表单（共享组件）
 * 复用于 ToolkitLandingPage 和 ToolkitTemplatePage
 */
export default function ToolkitEmailForm({ source, compact = false }: ToolkitEmailFormProps) {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const trimmed = email.trim()
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError('请输入有效的邮箱地址')
      return
    }

    setSubmitting(true)

    try {
      const res = await fetch(FORMSUBMIT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          email: trimmed,
          _subject: '新用户领取工具包',
          _template: 'table',
          source,
          timestamp: new Date().toISOString(),
        }),
      })

      if (res.ok) {
        setSubmitted(true)
      } else {
        setError('提交失败，请稍后重试')
      }
    } catch {
      // 网络错误时回退到 mailto
      setSubmitted(true)
      const subject = encodeURIComponent('领取：企业培训决策工具包')
      const body = encodeURIComponent(`我想免费领取"企业培训决策工具包"。\n\n邮箱: ${trimmed}`)
      window.open(`mailto:trainhub.toolkit@gmail.com?subject=${subject}&body=${body}`, '_self')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className={compact ? 'py-4 text-center' : 'py-8 text-center'}>
        <CheckCircle className={`mx-auto ${compact ? 'h-10 w-10' : 'h-16 w-16'} text-green-300`} />
        <h2 className={`mt-4 ${compact ? 'text-xl' : 'text-2xl'} font-bold text-white`}>
          领取成功！
        </h2>
        <p className="mt-3 text-blue-100">
          工具包已准备好，你可以直接在线使用全部 6 份模板。
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            to="/toolkit/needs-analysis"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-400 px-5 py-2.5 text-sm font-semibold text-green-900 transition-colors hover:bg-green-300"
          >
            <ClipboardList className="h-4 w-4" /> 立即使用工具包
          </Link>
          <Link
            to="/tools/roi-calculator"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-white/20 px-5 py-2.5 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/30"
          >
            <TrendingUp className="h-4 w-4" /> ROI 计算器
          </Link>
        </div>
      </div>
    )
  }

  return (
    <>
      <Download className={`mx-auto ${compact ? 'h-8 w-8' : 'h-12 w-12'} text-white/80`} />
      <h2 className={`mt-4 ${compact ? 'text-xl' : 'text-2xl sm:text-3xl'} font-bold text-white`}>
        {compact ? '免费领取完整工具包' : '免费领取工具包'}
      </h2>
      <p className="mt-3 text-blue-100">
        {compact
          ? '留下邮箱，获取全部 6 份专业培训管理模板'
          : '留下邮箱，立即获取 6 份专业培训管理模板 + 2026 趋势报告'}
      </p>
      <form ref={formRef} onSubmit={handleSubmit} className="mt-8">
        <div className="flex gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@company.com"
              className="w-full rounded-lg border-0 py-3 pl-10 pr-4 text-gray-900 shadow-sm ring-1 ring-inset ring-white/20 placeholder:text-gray-400 focus:ring-2 focus:ring-green-400"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="shrink-0 rounded-lg bg-green-500 px-6 py-3 font-semibold text-white shadow-sm transition-colors hover:bg-green-400 disabled:opacity-60"
          >
            {submitting ? '提交中...' : '免费领取'}
          </button>
        </div>
        {error && (
          <p className="mt-2 text-sm text-red-200">{error}</p>
        )}
        <p className="mt-3 text-xs text-blue-200">
          仅用于发送工具包资料，不会发送垃圾邮件
        </p>
      </form>
    </>
  )
}
