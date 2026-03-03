import { getLevelLabel, getLevelColor, getBarColor } from '@/lib/assessment'
import type { AssessmentReport } from '@/lib/assessment'

interface ResultReportProps {
  report: AssessmentReport
}

export default function ResultReport({ report }: ResultReportProps) {
  return (
    <div>
      {/* 报告标题 */}
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900">培训需求诊断报告</h2>
        <p className="mt-2 text-gray-500">基于您的评估结果生成的专业诊断</p>
      </div>

      {/* 总体评级卡片 */}
      <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6 sm:p-8">
        <div className="flex flex-col items-center gap-6 sm:flex-row">
          <div className={`flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-2xl border-2 text-3xl font-black ${getLevelColor(report.overallLevel)}`}>
            {report.overallLevel}
          </div>
          <div className="text-center sm:text-left">
            <div className="flex items-center gap-3">
              <h3 className="text-xl font-bold text-gray-900">
                综合评级：{getLevelLabel(report.overallLevel)}
              </h3>
              <span className="text-lg font-semibold text-gray-500">
                {report.overallScore} / 5.0
              </span>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              {report.overallComment}
            </p>
          </div>
        </div>
      </div>

      {/* 各维度详细结果 */}
      <div className="space-y-4">
        {report.dimensions.map(result => (
          <div
            key={result.dimension.id}
            className="rounded-xl border border-gray-200 bg-white p-6"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-gray-900">
                {result.dimension.name}
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-600">
                  {result.averageScore} / 5.0
                </span>
                <span className={`rounded-full border px-2.5 py-0.5 text-xs font-bold ${getLevelColor(result.level)}`}>
                  {result.level} {getLevelLabel(result.level)}
                </span>
              </div>
            </div>

            <div className="mt-3 h-2.5 rounded-full bg-gray-100">
              <div
                className={`h-2.5 rounded-full transition-all duration-700 ${getBarColor(result.level)}`}
                style={{ width: `${(result.averageScore / 5) * 100}%` }}
              />
            </div>

            <p className="mt-3 text-sm text-gray-600">{result.comment}</p>

            {result.suggestions.length > 0 && (
              <div className="mt-3">
                <p className="text-xs font-semibold text-gray-500 mb-1.5">改进建议：</p>
                <ul className="space-y-1">
                  {result.suggestions.map((suggestion, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-400" />
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
