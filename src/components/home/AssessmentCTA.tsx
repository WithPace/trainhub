import { Link } from 'react-router-dom'
import { ArrowRight, ClipboardCheck } from 'lucide-react'

export default function AssessmentCTA() {
  return (
    <section className="bg-gradient-to-br from-indigo-50 to-blue-50 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100">
          <ClipboardCheck className="h-7 w-7 text-indigo-600" />
        </div>
        <h2 className="mt-5 text-2xl font-bold text-gray-900 sm:text-3xl">
          不确定从哪里开始？3分钟诊断培训需求
        </h2>
        <p className="mt-3 text-gray-500">
          回答 10 个问题，快速了解企业在领导力、专业技能、团队协作、数字化能力四个维度的培训现状，获取专属诊断报告
        </p>
        <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            to="/assessment"
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-8 py-3 font-medium text-white transition-colors hover:bg-indigo-700"
          >
            开始需求诊断 <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/match"
            className="inline-block rounded-lg border border-gray-300 bg-white px-8 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            直接智能匹配
          </Link>
        </div>
      </div>
    </section>
  )
}
