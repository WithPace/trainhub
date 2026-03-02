import { useState } from 'react'
import { X } from 'lucide-react'
import type { Inquiry } from '@/types'
import { submitInquiry } from '@/services/api'

interface InquiryModalProps {
  isOpen: boolean
  onClose: () => void
  courseId?: number
  trainerId?: number
  title?: string
}

export default function InquiryModal({ isOpen, onClose, courseId, trainerId, title }: InquiryModalProps) {
  const [form, setForm] = useState<Inquiry>({
    course_id: courseId,
    trainer_id: trainerId,
    company_name: '',
    contact_name: '',
    contact_email: '',
    contact_phone: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      await submitInquiry(form)
      setSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : '提交失败，请稍后重试')
    } finally {
      setSubmitting(false)
    }
  }

  const handleChange = (field: keyof Inquiry, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const handleClose = () => {
    onClose()
    setSubmitted(false)
  }

  const inputClass = 'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">
        {/* 头部 */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">
            {title ?? '提交咨询'}
          </h2>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {submitted ? (
          /* 提交成功 */
          <div className="px-6 py-10 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <span className="text-3xl">✓</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">咨询已记录</h3>
            <p className="mt-2 text-sm text-gray-500">
              您的培训需求已保存。您也可以通过以下方式直接联系我们：
            </p>
            <div className="mt-4 space-y-2 text-sm text-gray-600">
              <p>微信：<span className="font-mono font-semibold">TrainHub2026</span></p>
              <p>电话：<span className="font-semibold">138-0000-1111</span></p>
            </div>
            <button
              type="button"
              onClick={handleClose}
              className="mt-6 rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              好的
            </button>
          </div>
        ) : (
          /* 表单 */
          <form onSubmit={handleSubmit} className="space-y-4 px-6 py-6">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                公司名称 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={form.company_name}
                onChange={e => handleChange('company_name', e.target.value)}
                placeholder="请输入公司全称"
                className={inputClass}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  联系人 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.contact_name}
                  onChange={e => handleChange('contact_name', e.target.value)}
                  placeholder="您的姓名"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  联系电话 <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={form.contact_phone}
                  onChange={e => handleChange('contact_phone', e.target.value)}
                  placeholder="手机号码"
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                邮箱
              </label>
              <input
                type="email"
                value={form.contact_email ?? ''}
                onChange={e => handleChange('contact_email', e.target.value)}
                placeholder="方便我们发送方案（可选）"
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                咨询内容
              </label>
              <textarea
                rows={3}
                value={form.message ?? ''}
                onChange={e => handleChange('message', e.target.value)}
                placeholder="请描述您的培训需求（可选）"
                className={inputClass}
              />
            </div>

            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-lg bg-blue-600 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
            >
              {submitting ? '提交中...' : '提交咨询'}
            </button>

            <p className="text-center text-xs text-gray-400">
              提交即表示您同意我们使用您的信息来联系您
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
