import { dimensions, allQuestionIds, ratingLabels } from '@/lib/assessment'

interface QuestionnaireProps {
  scores: Record<string, number>
  showResult: boolean
  onScore: (questionId: string, score: number) => void
  onSubmit: () => void
}

export default function Questionnaire({ scores, showResult, onScore, onSubmit }: QuestionnaireProps) {
  const allAnswered = allQuestionIds.every(id => scores[id] !== undefined)

  return (
    <section className="px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl space-y-8">
        {dimensions.map((dimension, dimIndex) => (
          <div
            key={dimension.id}
            className="rounded-xl border border-gray-200 bg-white overflow-hidden"
          >
            {/* 维度标题 */}
            <div className="border-b border-gray-100 bg-gray-50 px-6 py-4">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-sm font-bold text-blue-700">
                  {dimIndex + 1}
                </span>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">{dimension.name}</h2>
                  <p className="mt-0.5 text-sm text-gray-500">{dimension.description}</p>
                </div>
              </div>
            </div>

            {/* 该维度下的问题 */}
            <div className="divide-y divide-gray-100">
              {dimension.questions.map((question, qIndex) => {
                const globalIndex = dimensions
                  .slice(0, dimIndex)
                  .reduce((sum, d) => sum + d.questions.length, 0) + qIndex + 1
                const currentScore = scores[question.id]

                return (
                  <div key={question.id} className="px-6 py-5">
                    <p className="text-sm font-medium text-gray-800">
                      <span className="mr-2 text-gray-400">{globalIndex}.</span>
                      {question.text}
                    </p>

                    <div className="mt-3">
                      {/* 移动端标签提示 */}
                      <div className="mb-2 flex justify-between text-xs text-gray-400 sm:hidden">
                        <span>完全不同意</span>
                        <span>完全同意</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="hidden text-xs text-gray-400 sm:block sm:w-20 sm:text-right">
                          完全不同意
                        </span>
                        {[1, 2, 3, 4, 5].map(score => (
                          <button
                            key={score}
                            type="button"
                            onClick={() => onScore(question.id, score)}
                            title={ratingLabels[score - 1]}
                            className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border-2 text-sm font-semibold transition-all ${
                              currentScore === score
                                ? 'border-blue-600 bg-blue-600 text-white'
                                : 'border-gray-200 bg-white text-gray-600 hover:border-blue-300 hover:bg-blue-50'
                            }`}
                          >
                            {score}
                          </button>
                        ))}
                        <span className="hidden text-xs text-gray-400 sm:block sm:w-20">
                          完全同意
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}

        {/* 提交按钮 */}
        {!showResult && (
          <div className="text-center">
            <p className="mb-4 text-sm text-gray-500">
              已完成 {Object.keys(scores).length} / {allQuestionIds.length} 题
            </p>
            <button
              type="button"
              onClick={onSubmit}
              disabled={!allAnswered}
              className={`inline-flex items-center gap-2 rounded-lg px-8 py-3 text-base font-semibold transition-all ${
                allAnswered
                  ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/25'
                  : 'cursor-not-allowed bg-gray-200 text-gray-400'
              }`}
            >
              生成诊断报告
            </button>
            {!allAnswered && (
              <p className="mt-2 text-xs text-gray-400">请完成所有题目后提交</p>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
