import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Calculator, ArrowRight, Download, RotateCcw, Building2, Users, Target, TrendingUp, Info } from 'lucide-react'
import PageHead from '@/components/seo/PageHead'
import { JsonLd } from '@/components/seo/JsonLd'

// 行业培训投入基准（人均年培训费，单位：元）
const INDUSTRY_BENCHMARKS: Record<string, { label: string; perCapita: number; avgDays: number }> = {
  tech: { label: '互联网/科技', perCapita: 3500, avgDays: 5 },
  finance: { label: '金融/银行', perCapita: 4200, avgDays: 6 },
  manufacturing: { label: '制造业', perCapita: 2000, avgDays: 4 },
  retail: { label: '零售/消费品', perCapita: 1800, avgDays: 3 },
  healthcare: { label: '医疗/医药', perCapita: 3000, avgDays: 5 },
  education: { label: '教育', perCapita: 2500, avgDays: 4 },
  realestate: { label: '地产/建筑', perCapita: 2200, avgDays: 3 },
  logistics: { label: '物流/供应链', perCapita: 1500, avgDays: 3 },
  energy: { label: '能源/化工', perCapita: 2800, avgDays: 4 },
  consulting: { label: '咨询/专业服务', perCapita: 5000, avgDays: 7 },
}

// 企业规模系数
const SCALE_FACTORS: Record<string, { label: string; factor: number; overhead: number }> = {
  small: { label: '50人以下', factor: 0.8, overhead: 0.1 },
  medium: { label: '50-200人', factor: 1.0, overhead: 0.15 },
  large: { label: '200-1000人', factor: 1.15, overhead: 0.2 },
  enterprise: { label: '1000人以上', factor: 1.3, overhead: 0.25 },
}

// 培训目标权重
const TRAINING_GOALS: { id: string; label: string; costMultiplier: number }[] = [
  { id: 'onboarding', label: '新员工入职培训', costMultiplier: 0.8 },
  { id: 'leadership', label: '管理者领导力提升', costMultiplier: 1.5 },
  { id: 'skills', label: '专业技能提升', costMultiplier: 1.0 },
  { id: 'digital', label: '数字化/AI 转型', costMultiplier: 1.3 },
  { id: 'sales', label: '销售能力提升', costMultiplier: 1.2 },
  { id: 'compliance', label: '合规/安全培训', costMultiplier: 0.7 },
  { id: 'teambuilding', label: '团队协作/沟通', costMultiplier: 0.9 },
]

interface BudgetResult {
  totalBudget: number
  perCapitaBudget: number
  industryBenchmark: number
  breakdown: {
    externalTrainer: number
    internalTrainer: number
    platformLicense: number
    materialsCost: number
    venueCost: number
    overhead: number
  }
  recommendations: string[]
  benchmarkComparison: 'below' | 'average' | 'above'
}

export default function BudgetCalculatorPage() {
  const [industry, setIndustry] = useState('')
  const [scale, setScale] = useState('')
  const [headcount, setHeadcount] = useState('')
  const [traineePercent, setTraineePercent] = useState('60')
  const [goals, setGoals] = useState<string[]>([])
  const [showResult, setShowResult] = useState(false)

  const toggleGoal = (id: string) => {
    setGoals(prev => prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id])
  }

  const result = useMemo<BudgetResult | null>(() => {
    if (!industry || !scale || !headcount || goals.length === 0) return null

    const bench = INDUSTRY_BENCHMARKS[industry]
    const scaleFactor = SCALE_FACTORS[scale]
    const count = parseInt(headcount, 10)
    const traineeRatio = parseInt(traineePercent, 10) / 100

    if (!bench || !scaleFactor || isNaN(count) || count <= 0) return null

    // 计算目标加权系数
    const goalMultiplier = goals.reduce((sum, gId) => {
      const g = TRAINING_GOALS.find(tg => tg.id === gId)
      return sum + (g?.costMultiplier ?? 1)
    }, 0) / goals.length

    // 人均预算 = 行业基准 × 规模系数 × 目标权重
    const perCapita = Math.round(bench.perCapita * scaleFactor.factor * goalMultiplier)
    const traineeCount = Math.round(count * traineeRatio)
    const totalBudget = perCapita * traineeCount

    // 预算分解
    const externalTrainer = Math.round(totalBudget * 0.45)
    const internalTrainer = Math.round(totalBudget * 0.15)
    const platformLicense = Math.round(totalBudget * 0.12)
    const materialsCost = Math.round(totalBudget * 0.08)
    const venueCost = Math.round(totalBudget * 0.05)
    const overhead = Math.round(totalBudget * scaleFactor.overhead)

    // 行业对比
    const benchmarkRatio = perCapita / bench.perCapita
    const benchmarkComparison: BudgetResult['benchmarkComparison'] =
      benchmarkRatio < 0.85 ? 'below' : benchmarkRatio > 1.15 ? 'above' : 'average'

    // 建议
    const recommendations: string[] = []
    if (benchmarkComparison === 'below') {
      recommendations.push(`您的人均培训预算低于${bench.label}行业平均水平，建议适当增加投入以保持人才竞争力`)
    }
    if (goals.includes('leadership') && count > 200) {
      recommendations.push('大型企业的领导力培训建议采用分层分批模式，高管班和中层班分开设计')
    }
    if (goals.includes('digital')) {
      recommendations.push('数字化转型培训建议搭配实操工作坊，纯理论课程转化率低于30%')
    }
    if (traineeRatio < 0.5) {
      recommendations.push('参训覆盖率偏低（<50%），建议逐步扩大覆盖范围以提升组织整体能力')
    }
    if (goals.length >= 4) {
      recommendations.push('培训目标较多，建议按季度分批实施，聚焦每季度1-2个核心主题')
    }
    if (scaleFactor.overhead > 0.2) {
      recommendations.push('大型企业建议建设内训师队伍，长期可降低30-40%的外部培训成本')
    }
    if (recommendations.length === 0) {
      recommendations.push('您的培训预算规划合理，建议定期复盘培训效果并按需调整预算分配')
    }

    return {
      totalBudget,
      perCapitaBudget: perCapita,
      industryBenchmark: bench.perCapita,
      breakdown: { externalTrainer, internalTrainer, platformLicense, materialsCost, venueCost, overhead },
      recommendations,
      benchmarkComparison,
    }
  }, [industry, scale, headcount, traineePercent, goals])

  const handleCalculate = () => {
    if (result) setShowResult(true)
  }

  const handleReset = () => {
    setIndustry('')
    setScale('')
    setHeadcount('')
    setTraineePercent('60')
    setGoals([])
    setShowResult(false)
  }

  const formatCurrency = (n: number) =>
    n >= 10000
      ? `${(n / 10000).toFixed(1)}万元`
      : `${n.toLocaleString()}元`

  const canCalculate = industry && scale && headcount && goals.length > 0

  return (
    <>
      <PageHead
        title="培训预算计算器 — 免费在线工具 | TrainHub"
        description="根据行业、企业规模和培训目标，智能计算年度培训预算。包含预算分解、行业对标和专家建议。完全免费，无需注册。"
        path="/tools/budget-calculator"
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: '培训预算计算器',
          description: '根据行业、企业规模和培训目标，智能计算年度培训预算',
          applicationCategory: 'BusinessApplication',
          operatingSystem: 'Web',
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'CNY' },
        }}
      />

      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        {/* 标题 */}
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100">
            <Calculator className="h-7 w-7 text-blue-600" />
          </div>
          <h1 className="mt-4 text-2xl font-bold text-gray-900 sm:text-3xl">培训预算计算器</h1>
          <p className="mt-2 text-gray-500">
            输入企业信息，3步获取科学的年度培训预算方案
          </p>
        </div>

        {!showResult ? (
          /* ──── 输入表单 ──── */
          <div className="mt-10 space-y-8">
            {/* Step 1: 企业信息 */}
            <div className="rounded-xl border border-gray-200 p-6">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                <Building2 className="h-5 w-5 text-blue-600" />
                第 1 步：企业基本信息
              </h2>

              <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
                {/* 行业 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">所属行业</label>
                  <select
                    value={industry}
                    onChange={e => setIndustry(e.target.value)}
                    className="mt-1.5 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="">请选择行业</option>
                    {Object.entries(INDUSTRY_BENCHMARKS).map(([k, v]) => (
                      <option key={k} value={k}>{v.label}</option>
                    ))}
                  </select>
                </div>

                {/* 规模 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">企业规模</label>
                  <select
                    value={scale}
                    onChange={e => setScale(e.target.value)}
                    className="mt-1.5 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="">请选择规模</option>
                    {Object.entries(SCALE_FACTORS).map(([k, v]) => (
                      <option key={k} value={k}>{v.label}</option>
                    ))}
                  </select>
                </div>

                {/* 人数 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">员工总人数</label>
                  <input
                    type="number"
                    min="1"
                    max="100000"
                    value={headcount}
                    onChange={e => setHeadcount(e.target.value)}
                    placeholder="例如：150"
                    className="mt-1.5 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                {/* 参训比例 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    预计参训人员比例
                    <span className="ml-1 text-xs text-gray-400">（占总人数）</span>
                  </label>
                  <div className="mt-1.5 flex items-center gap-3">
                    <input
                      type="range"
                      min="10"
                      max="100"
                      step="10"
                      value={traineePercent}
                      onChange={e => setTraineePercent(e.target.value)}
                      className="flex-1"
                    />
                    <span className="w-12 text-right text-sm font-medium text-gray-900">{traineePercent}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2: 培训目标 */}
            <div className="rounded-xl border border-gray-200 p-6">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                <Target className="h-5 w-5 text-blue-600" />
                第 2 步：培训目标（可多选）
              </h2>

              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {TRAINING_GOALS.map(goal => (
                  <button
                    key={goal.id}
                    type="button"
                    onClick={() => toggleGoal(goal.id)}
                    className={`rounded-lg border px-4 py-3 text-left text-sm font-medium transition-all ${
                      goals.includes(goal.id)
                        ? 'border-blue-500 bg-blue-50 text-blue-700 ring-1 ring-blue-500'
                        : 'border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {goal.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 计算按钮 */}
            <div className="flex justify-center gap-4">
              <button
                type="button"
                onClick={handleCalculate}
                disabled={!canCalculate}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-8 py-3 font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
              >
                计算预算方案 <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        ) : result ? (
          /* ──── 结果展示 ──── */
          <div className="mt-10 space-y-8">
            {/* 总预算 */}
            <div className="rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 p-8 text-white">
              <h2 className="text-lg font-medium text-blue-100">推荐年度培训预算</h2>
              <div className="mt-2 text-4xl font-bold">{formatCurrency(result.totalBudget)}</div>
              <div className="mt-3 flex flex-wrap gap-4 text-sm text-blue-200">
                <span>人均 {formatCurrency(result.perCapitaBudget)}</span>
                <span>·</span>
                <span>行业均值 {formatCurrency(result.industryBenchmark)}</span>
                <span>·</span>
                <span>
                  {result.benchmarkComparison === 'below'
                    ? '低于行业水平'
                    : result.benchmarkComparison === 'above'
                      ? '高于行业水平'
                      : '符合行业水平'}
                </span>
              </div>
            </div>

            {/* 预算分解 */}
            <div className="rounded-xl border border-gray-200 p-6">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                预算分解
              </h3>
              <div className="mt-5 space-y-4">
                {[
                  { label: '外部培训师/机构费用', value: result.breakdown.externalTrainer, percent: 45, color: 'bg-blue-500' },
                  { label: '内部培训师培养', value: result.breakdown.internalTrainer, percent: 15, color: 'bg-indigo-500' },
                  { label: '学习平台/工具许可', value: result.breakdown.platformLicense, percent: 12, color: 'bg-purple-500' },
                  { label: '教材/课件制作', value: result.breakdown.materialsCost, percent: 8, color: 'bg-pink-500' },
                  { label: '场地/差旅', value: result.breakdown.venueCost, percent: 5, color: 'bg-orange-500' },
                  { label: '管理及运营费用', value: result.breakdown.overhead, percent: Math.round(SCALE_FACTORS[scale]?.overhead * 100 || 15), color: 'bg-gray-400' },
                ].map(item => (
                  <div key={item.label}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-700">{item.label}</span>
                      <span className="font-medium text-gray-900">{formatCurrency(item.value)}</span>
                    </div>
                    <div className="mt-1.5 h-2 w-full rounded-full bg-gray-100">
                      <div
                        className={`h-2 rounded-full ${item.color}`}
                        style={{ width: `${item.percent}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 专家建议 */}
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-6">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                <Info className="h-5 w-5 text-amber-600" />
                专家建议
              </h3>
              <ul className="mt-4 space-y-3">
                {result.recommendations.map((rec, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-200 text-xs font-bold text-amber-800">
                      {i + 1}
                    </span>
                    {rec}
                  </li>
                ))}
              </ul>
            </div>

            {/* 行业对标参考 */}
            <div className="rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900">行业人均培训投入对标</h3>
              <div className="mt-5 space-y-3">
                {Object.entries(INDUSTRY_BENCHMARKS).map(([k, v]) => (
                  <div key={k} className="flex items-center gap-3">
                    <span className="w-28 shrink-0 text-sm text-gray-600">{v.label}</span>
                    <div className="flex-1">
                      <div className="h-3 w-full rounded-full bg-gray-100">
                        <div
                          className={`h-3 rounded-full ${k === industry ? 'bg-blue-600' : 'bg-gray-300'}`}
                          style={{ width: `${(v.perCapita / 5000) * 100}%` }}
                        />
                      </div>
                    </div>
                    <span className={`w-20 text-right text-sm font-medium ${k === industry ? 'text-blue-600' : 'text-gray-500'}`}>
                      {formatCurrency(v.perCapita)}
                    </span>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs text-gray-400">
                * 数据来源：中国培训行业白皮书、人力资源和社会保障部统计数据、企业调研汇总。仅供参考。
              </p>
            </div>

            {/* 操作按钮 */}
            <div className="flex flex-wrap justify-center gap-4">
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-6 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                <RotateCcw className="h-4 w-4" /> 重新计算
              </button>
              <Link
                to="/assessment"
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
              >
                继续做需求诊断 <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* 免责声明 */}
            <p className="text-center text-xs text-gray-400">
              本计算器基于行业公开数据和统计模型提供参考建议，实际预算请结合企业具体情况制定。
            </p>
          </div>
        ) : null}

        {/* 相关工具推荐 */}
        <div className="mt-16 border-t border-gray-200 pt-10">
          <h3 className="text-center text-lg font-semibold text-gray-900">更多免费工具</h3>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Link
              to="/assessment"
              className="group rounded-xl border border-gray-200 p-5 transition-all hover:border-blue-300 hover:shadow-md"
            >
              <h4 className="font-semibold text-gray-900 group-hover:text-blue-600">培训需求诊断</h4>
              <p className="mt-1 text-sm text-gray-500">10 个问题，了解企业四大维度培训现状</p>
            </Link>
            <Link
              to="/tools/roi-calculator"
              className="group rounded-xl border border-gray-200 p-5 transition-all hover:border-blue-300 hover:shadow-md"
            >
              <h4 className="font-semibold text-gray-900 group-hover:text-blue-600">培训 ROI 计算器</h4>
              <p className="mt-1 text-sm text-gray-500">量化培训投入产出比，用数据说服老板</p>
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
