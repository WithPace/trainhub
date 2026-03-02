import { useState } from 'react'
import { MessageCircle, X, Mail, Phone } from 'lucide-react'

/**
 * 全站浮动咨询按钮 — 提供快速联系入口
 * 点击展开显示微信、电话、邮箱三种联系方式
 */
export default function FloatingContact() {
  const [open, setOpen] = useState(false)

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      {/* 展开的联系方式面板 */}
      {open && (
        <div className="mb-2 w-72 max-w-[calc(100vw-2rem)] rounded-xl border border-gray-200 bg-white p-4 shadow-2xl sm:p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">
              联系我们
            </h3>
            <button
              onClick={() => setOpen(false)}
              className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              aria-label="关闭"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-3">
            {/* 微信 */}
            <div className="rounded-lg bg-green-50 p-3">
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5 text-green-600" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 0 1 .598.082l1.584.926a.272.272 0 0 0 .14.045c.134 0 .24-.11.24-.245 0-.06-.024-.12-.04-.178l-.325-1.233a.49.49 0 0 1 .177-.554C23.028 18.48 24 16.82 24 14.98c0-3.21-2.994-5.95-7.062-6.122z" />
                </svg>
                <span className="text-sm font-medium text-green-800">微信咨询</span>
              </div>
              <p className="mt-2 text-xs text-green-700">
                添加微信：<span className="font-mono font-semibold">TrainHub2026</span>
              </p>
              <p className="mt-1 text-xs text-green-600">
                备注"培训咨询"优先回复
              </p>
            </div>

            {/* 电话 */}
            <a
              href="tel:+8613800001111"
              className="flex items-center gap-3 rounded-lg border border-gray-200 p-3 transition-colors hover:bg-gray-50"
            >
              <Phone className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">电话咨询</p>
                <p className="text-xs text-gray-500">138-0000-1111（工作日 9:00-18:00）</p>
              </div>
            </a>

            {/* 邮箱 */}
            <a
              href="mailto:hi@trainhub.cn?subject=培训咨询"
              className="flex items-center gap-3 rounded-lg border border-gray-200 p-3 transition-colors hover:bg-gray-50"
            >
              <Mail className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">邮件咨询</p>
                <p className="text-xs text-gray-500">hi@trainhub.cn</p>
              </div>
            </a>
          </div>

          <p className="mt-3 text-center text-xs text-gray-400">
            通常 2 小时内回复
          </p>
        </div>
      )}

      {/* 浮动按钮 */}
      <button
        onClick={() => setOpen(!open)}
        className={`flex h-12 w-12 items-center justify-center rounded-full shadow-lg transition-all sm:h-14 sm:w-14 ${
          open
            ? 'bg-gray-600 hover:bg-gray-700'
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
        aria-label={open ? '关闭咨询面板' : '在线咨询'}
      >
        {open ? (
          <X className="h-6 w-6 text-white" />
        ) : (
          <MessageCircle className="h-6 w-6 text-white" />
        )}
      </button>
    </div>
  )
}
