import { useState } from 'react'
import { X } from 'lucide-react'
import type { Inquiry } from '@/types'

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
    contact_phone: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Mock 提交：实际场景会发 API 请求
    console.log('咨询表单提交:', form)
    setSubmitted(true)
  }

  const handleChange = (field: keyof Inquiry, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

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
            onClick={() => { onClose(); setSubmitted(false) }}
            className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {submitted ? (
          /* 提交成功 */
          <div className="px-6 py-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <span className="text-3xl">✓</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">咨询已提交</h3>
            <p className="mt-2 text-sm text-gray-500">
              我们会在1个工作日内与您联系，请保持电话畅通。
            </p>
            <button
              type="button"
              onClick={() => { onClose(); setSubmitted(false) }}
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
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

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
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-blue-600 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
            >
              提交咨询
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
