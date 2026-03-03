import { Link } from 'react-router-dom'

interface ActionPanelProps {
  onReset: () => void
}

export default function ActionPanel({ onReset }: ActionPanelProps) {
  return (
    <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 sm:p-8">
      <h3 className="text-center text-lg font-bold text-gray-900">下一步行动</h3>
      <p className="mt-2 text-center text-sm text-gray-500">
        根据诊断结果，获取更精准的培训解决方案
      </p>
      <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <Link
          to="/match"
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700 sm:w-auto"
        >
          获取定制培训方案
        </Link>
        <Link
          to="/about"
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 sm:w-auto"
        >
          免费咨询培训顾问
        </Link>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 sm:w-auto"
        >
          重新评估
        </button>
      </div>
    </div>
  )
}
