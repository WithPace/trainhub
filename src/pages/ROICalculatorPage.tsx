import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { BarChart3, ArrowRight, RotateCcw, DollarSign, TrendingUp, Info } from 'lucide-react'
import PageHead from '@/components/seo/PageHead'
import { JsonLd } from '@/components/seo/JsonLd'

// Kirkpatrick 四级评估 + Phillips ROI 方法论
// Level 1: Reaction, Level 2: Learning, Level 3: Behavior, Level 4: Results, Level 5: ROI

interface ROIResult {
  totalCost: number
  totalBenefit: number
  roi: number
  paybackMonths: number
  benefitBreakdown: { label: string; value: number }[]
  levelAnalysis: { level: string; description: string; score: string }[]
  verdict: 'excellent' | 'good' | 'marginal' | 'negative'
}

export default function ROICalculatorPage() {
  // 成本输入
  const [trainerFee, setTrainerFee] = useState('')
  const [venueCost, setVenueCost] = useState('')
  const [materialCost, setMaterialCost] = useState('')
  const [participantCount, setParticipantCount] = useState('')
  const [trainingDays, setTrainingDays] = useState('2')
  const [avgSalaryDaily, setAvgSalaryDaily] = useState('')

  // 收益输入
  const [productivityGain, setProductivityGain] = useState('10')
  const [errorReduction, setErrorReduction] = useState('15')
  const [turnoverReduction, setTurnoverReduction] = useState('5')
  const [revenueImpact, setRevenueImpact] = useState('')

  const [showResult, setShowResult] = useState(false)

  const result = useMemo<ROIResult | null>(() => {
    const participants = parseInt(participantCount, 10)
    const days = parseInt(trainingDays, 10)
    const salary = parseFloat(avgSalaryDaily)
    const trainer = parseFloat(trainerFee) || 0
    const venue = parseFloat(venueCost) || 0
    const material = parseFloat(materialCost) || 0

    if (!participants || !days || !salary || participants <= 0) return null

    // 总成本 = 直接成本 + 机会成本（工资损失）
    const directCost = trainer + venue + material
    const opportunityCost = participants * days * salary
    const totalCost = directCost + opportunityCost

    // 收益估算（年化）
    const prodGainPct = parseInt(productivityGain, 10) / 100
    const errReducePct = parseInt(errorReduction, 10) / 100
    const turnoverPct = parseInt(turnoverReduction, 10) / 100
    const annualSalary = salary * 250 // 250个工作日

    // 生产力提升收益 = 参训人数 × 年薪 × 提升比例
    const productivityBenefit = Math.round(participants * annualSalary * prodGainPct)

    // 错误/返工减少收益（按年薪的5%为基准错误成本）
    const errorBenefit = Math.round(participants * annualSalary * 0.05 * errReducePct)

    // 离职率降低收益（替换一个员工成本约为6个月薪资）
    const turnoverBenefit = Math.round(participants * (annualSalary * 0.5) * turnoverPct)

    // 直接营收影响
    const revenueBenefit = parseFloat(revenueImpact) || 0

    const totalBenefit = productivityBenefit + errorBenefit + turnoverBenefit + revenueBenefit

    const roi = totalCost > 0 ? Math.round(((totalBenefit - totalCost) / totalCost) * 100) : 0
    const paybackMonths = totalBenefit > 0 ? Math.round((totalCost / totalBenefit) * 12) : 99

    const verdict: ROIResult['verdict'] =
      roi >= 200 ? 'excellent' :
      roi >= 50 ? 'good' :
      roi >= 0 ? 'marginal' :
      'negative'

    return {
      totalCost,
      totalBenefit,
      roi,
      paybackMonths,
      benefitBreakdown: [
        { label: '生产力提升', value: productivityBenefit },
        { label: '错误/返工减少', value: errorBenefit },
        { label: '人才保留', value: turnoverBenefit },
        ...(revenueBenefit > 0 ? [{ label: '直接营收影响', value: revenueBenefit }] : []),
      ],
      levelAnalysis: [
        {
          level: 'Level 1: 反应',
          description: '学员对培训的满意度和参与度',
          score: '需实际调研',
        },
        {
          level: 'Level 2: 学习',
          description: '知识和技能的掌握程度',
          score: '需前后测评',
        },
        {
          level: 'Level 3: 行为',
          description: '工作中行为改变的程度',
          score: `预计 ${productivityGain}% 提升`,
        },
        {
          level: 'Level 4: 结果',
          description: '对业务指标的影响',
          score: `年化收益 ${formatCurrency(totalBenefit)}`,
        },
        {
          level: 'Level 5: ROI',
          description: '投资回报率',
          score: `${roi}%`,
        },
      ],
      verdict,
    }
  }, [trainerFee, venueCost, materialCost, participantCount, trainingDays, avgSalaryDaily, productivityGain, errorReduction, turnoverReduction, revenueImpact])

  const handleCalculate = () => {
    if (result) setShowResult(true)
  }

  const handleReset = () => {
    setTrainerFee('')
    setVenueCost('')
    setMaterialCost('')
    setParticipantCount('')
    setTrainingDays('2')
    setAvgSalaryDaily('')
    setProductivityGain('10')
    setErrorReduction('15')
    setTurnoverReduction('5')
    setRevenueImpact('')
    setShowResult(false)
  }

  const canCalculate = participantCount && avgSalaryDaily

  return (
    <>
      <PageHead
        title="培训 ROI 计算器 — 量化培训投资回报 | TrainHub"
        description="基于 Phillips ROI 方法论，量化培训投入产出比。输入成本和预期收益，自动计算 ROI、回收期和 Kirkpatrick 五级评估。免费使用。"
        path="/tools/roi-calculator"
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: '培训 ROI 计算器',
          description: '基于 Phillips ROI 方法论，量化培训投入产出比',
          applicationCategory: 'BusinessApplication',
          operatingSystem: 'Web',
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'CNY' },
        }}
      />

      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        {/* 标题 */}
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100">
            <BarChart3 className="h-7 w-7 text-green-600" />
          </div>
          <h1 className="mt-4 text-2xl font-bold text-gray-900 sm:text-3xl">培训 ROI 计算器</h1>
          <p className="mt-2 text-gray-500">
            基于 Phillips ROI 方法论，用数据量化培训价值
          </p>
        </div>

        {!showResult ? (
          <div className="mt-10 space-y-8">
            {/* 成本输入 */}
            <div className="rounded-xl border border-gray-200 p-6">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                <DollarSign className="h-5 w-5 text-red-500" />
                培训成本
              </h2>

              <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">参训人数</label>
                  <input
                    type="number"
                    min="1"
                    value={participantCount}
                    onChange={e => setParticipantCount(e.target.value)}
                    placeholder="例如：30"
                    className="mt-1.5 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">培训天数</label>
                  <select
                    value={trainingDays}
                    onChange={e => setTrainingDays(e.target.value)}
                    className="mt-1.5 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  >
                    {[1, 2, 3, 5, 7, 10, 15, 20].map(d => (
                      <option key={d} value={d}>{d} 天</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    参训人员日均薪资（元）
                    <span className="ml-1 text-xs text-gray-400">月薪÷22</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={avgSalaryDaily}
                    onChange={e => setAvgSalaryDaily(e.target.value)}
                    placeholder="例如：800"
                    className="mt-1.5 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">培训师/机构费用（元）</label>
                  <input
                    type="number"
                    min="0"
                    value={trainerFee}
                    onChange={e => setTrainerFee(e.target.value)}
                    placeholder="例如：30000"
                    className="mt-1.5 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">场地费用（元）</label>
                  <input
                    type="number"
                    min="0"
                    value={venueCost}
                    onChange={e => setVenueCost(e.target.value)}
                    placeholder="例如：5000"
                    className="mt-1.5 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">教材/其他费用（元）</label>
                  <input
                    type="number"
                    min="0"
                    value={materialCost}
                    onChange={e => setMaterialCost(e.target.value)}
                    placeholder="例如：3000"
                    className="mt-1.5 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* 收益预估 */}
            <div className="rounded-xl border border-gray-200 p-6">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                <TrendingUp className="h-5 w-5 text-green-600" />
                预期收益（保守估计）
              </h2>

              <div className="mt-5 space-y-5">
                <div>
                  <label className="flex items-center justify-between text-sm font-medium text-gray-700">
                    <span>生产力提升预期</span>
                    <span className="text-blue-600">{productivityGain}%</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="30"
                    step="1"
                    value={productivityGain}
                    onChange={e => setProductivityGain(e.target.value)}
                    className="mt-1.5 w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>0%</span>
                    <span>行业均值 10%</span>
                    <span>30%</span>
                  </div>
                </div>

                <div>
                  <label className="flex items-center justify-between text-sm font-medium text-gray-700">
                    <span>错误/返工减少预期</span>
                    <span className="text-blue-600">{errorReduction}%</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="50"
                    step="5"
                    value={errorReduction}
                    onChange={e => setErrorReduction(e.target.value)}
                    className="mt-1.5 w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>0%</span>
                    <span>行业均值 15%</span>
                    <span>50%</span>
                  </div>
                </div>

                <div>
                  <label className="flex items-center justify-between text-sm font-medium text-gray-700">
                    <span>离职率降低预期</span>
                    <span className="text-blue-600">{turnoverReduction}%</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="20"
                    step="1"
                    value={turnoverReduction}
                    onChange={e => setTurnoverReduction(e.target.value)}
                    className="mt-1.5 w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>0%</span>
                    <span>行业均值 5%</span>
                    <span>20%</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    直接营收影响（元/年，选填）
                    <span className="ml-1 text-xs text-gray-400">如销售培训带来的业绩增长</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={revenueImpact}
                    onChange={e => setRevenueImpact(e.target.value)}
                    placeholder="可不填"
                    className="mt-1.5 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* 计算按钮 */}
            <div className="flex justify-center">
              <button
                type="button"
                onClick={handleCalculate}
                disabled={!canCalculate}
                className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-8 py-3 font-medium text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-300"
              >
                计算 ROI <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        ) : result ? (
          <div className="mt-10 space-y-8">
            {/* ROI 大字 */}
            <div className={`rounded-xl p-8 text-white ${
              result.verdict === 'excellent' ? 'bg-gradient-to-br from-green-600 to-emerald-700' :
              result.verdict === 'good' ? 'bg-gradient-to-br from-blue-600 to-indigo-700' :
              result.verdict === 'marginal' ? 'bg-gradient-to-br from-amber-500 to-orange-600' :
              'bg-gradient-to-br from-red-500 to-red-700'
            }`}>
              <h2 className="text-lg font-medium opacity-80">培训投资回报率 (ROI)</h2>
              <div className="mt-2 text-5xl font-bold">{result.roi}%</div>
              <div className="mt-3 flex flex-wrap gap-4 text-sm opacity-80">
                <span>总成本 {formatCurrency(result.totalCost)}</span>
                <span>·</span>
                <span>年化收益 {formatCurrency(result.totalBenefit)}</span>
                <span>·</span>
                <span>回收期 {result.paybackMonths > 12 ? '12+ 个月' : `${result.paybackMonths} 个月`}</span>
              </div>
              <div className="mt-4 inline-block rounded-full bg-white/20 px-4 py-1 text-sm font-medium">
                {result.verdict === 'excellent' ? '优秀 — 强烈建议投入'
                 : result.verdict === 'good' ? '良好 — 值得投入'
                 : result.verdict === 'marginal' ? '边际 — 需优化方案'
                 : '负回报 — 建议重新评估'}
              </div>
            </div>

            {/* 收益分解 */}
            <div className="rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900">收益来源分解</h3>
              <div className="mt-5 space-y-4">
                {result.benefitBreakdown.map(item => {
                  const pct = result.totalBenefit > 0 ? Math.round((item.value / result.totalBenefit) * 100) : 0
                  return (
                    <div key={item.label}>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-700">{item.label}</span>
                        <span className="font-medium text-gray-900">{formatCurrency(item.value)} ({pct}%)</span>
                      </div>
                      <div className="mt-1.5 h-2 w-full rounded-full bg-gray-100">
                        <div className="h-2 rounded-full bg-green-500" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Kirkpatrick 五级评估 */}
            <div className="rounded-xl border border-gray-200 p-6">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                <Info className="h-5 w-5 text-blue-600" />
                Kirkpatrick-Phillips 五级评估框架
              </h3>
              <div className="mt-5 space-y-3">
                {result.levelAnalysis.map((item, i) => (
                  <div key={i} className="flex items-center gap-4 rounded-lg bg-gray-50 p-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600">
                      {i + 1}
                    </span>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">{item.level}</div>
                      <div className="text-xs text-gray-500">{item.description}</div>
                    </div>
                    <span className="text-sm font-medium text-gray-700">{item.score}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="flex flex-wrap justify-center gap-4">
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <RotateCcw className="h-4 w-4" /> 重新计算
              </button>
              <Link
                to="/tools/budget-calculator"
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
              >
                去算培训预算 <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <p className="text-center text-xs text-gray-400">
              基于 Phillips ROI 方法论和 Kirkpatrick 评估模型。收益为年化估算值，实际效果取决于培训质量和执行力度。
            </p>
          </div>
        ) : null}

        {/* 相关工具 */}
        <div className="mt-16 border-t border-gray-200 pt-10">
          <h3 className="text-center text-lg font-semibold text-gray-900">更多免费工具</h3>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Link
              to="/tools/budget-calculator"
              className="group rounded-xl border border-gray-200 p-5 transition-all hover:border-blue-300 hover:shadow-md"
            >
              <h4 className="font-semibold text-gray-900 group-hover:text-blue-600">培训预算计算器</h4>
              <p className="mt-1 text-sm text-gray-500">根据行业和规模，计算科学的年度培训预算</p>
            </Link>
            <Link
              to="/assessment"
              className="group rounded-xl border border-gray-200 p-5 transition-all hover:border-blue-300 hover:shadow-md"
            >
              <h4 className="font-semibold text-gray-900 group-hover:text-blue-600">培训需求诊断</h4>
              <p className="mt-1 text-sm text-gray-500">10 个问题，了解企业四大维度培训现状</p>
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

function formatCurrency(n: number) {
  return n >= 10000
    ? `${(n / 10000).toFixed(1)}万元`
    : `${n.toLocaleString()}元`
}
