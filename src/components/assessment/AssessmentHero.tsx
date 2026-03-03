export default function AssessmentHero() {
  return (
    <section className="bg-gradient-to-br from-blue-600 to-indigo-700 px-4 py-12 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-3xl font-bold sm:text-4xl">企业培训需求诊断</h1>
        <p className="mt-3 text-lg text-blue-100">
          3分钟快速评估，找到最需要加强的培训方向
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm text-blue-200">
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-blue-300" />
            10道评估题目
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-blue-300" />
            4大能力维度
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-blue-300" />
            即时生成报告
          </span>
        </div>
      </div>
    </section>
  )
}
