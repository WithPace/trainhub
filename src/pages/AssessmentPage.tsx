import { useState, useMemo, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { JsonLd } from '@/components/seo/JsonLd'
import PageHead from '@/components/seo/PageHead'

// ──────────────────── 类型定义 ────────────────────

/** 评估维度 */
interface Dimension {
  id: string
  name: string
  description: string
  questions: AssessmentQuestion[]
}

/** 单个评估问题 */
interface AssessmentQuestion {
  id: string
  text: string
}

/** 各维度诊断结果 */
interface DimensionResult {
  dimension: Dimension
  averageScore: number
  level: 'A' | 'B' | 'C' | 'D'
  comment: string
  suggestions: string[]
}

/** 整体诊断报告 */
interface AssessmentReport {
  dimensions: DimensionResult[]
  overallScore: number
  overallLevel: 'A' | 'B' | 'C' | 'D'
  overallComment: string
}

// ──────────────────── 问卷数据 ────────────────────

const dimensions: Dimension[] = [
  {
    id: 'leadership',
    name: '领导力发展',
    description: '评估组织在管理者能力培养、战略思维和团队带领方面的现状',
    questions: [
      { id: 'l1', text: '管理者能有效激励团队成员并设定清晰的目标方向' },
      { id: 'l2', text: '公司有系统的管理者培养机制（如轮岗、导师制、管理培训）' },
      { id: 'l3', text: '中高层管理者具备应对变革和不确定性的能力' },
    ],
  },
  {
    id: 'professional',
    name: '专业技能',
    description: '评估员工在岗位核心技能、行业知识和专业素养方面的水平',
    questions: [
      { id: 'p1', text: '员工的专业技能能够满足当前业务发展的需求' },
      { id: 'p2', text: '公司定期组织专业技能培训和知识更新' },
      { id: 'p3', text: '员工能将所学知识有效转化为工作成果' },
    ],
  },
  {
    id: 'teamwork',
    name: '团队协作',
    description: '评估跨部门沟通、团队合作效率和组织协同能力',
    questions: [
      { id: 't1', text: '跨部门协作顺畅，信息共享机制运转良好' },
      { id: 't2', text: '团队成员之间信任度高，能高效解决冲突和分歧' },
    ],
  },
  {
    id: 'digital',
    name: '数字化能力',
    description: '评估组织在数字工具应用、数据驱动决策和数字化转型方面的成熟度',
    questions: [
      { id: 'd1', text: '员工熟练使用数字化工具提升工作效率（如AI、自动化工具）' },
      { id: 'd2', text: '管理层能用数据驱动业务决策，而非仅凭经验判断' },
    ],
  },
]

// 所有问题的 id 列表，用于校验是否全部作答
const allQuestionIds = dimensions.flatMap(d => d.questions.map(q => q.id))

// 评分选项
const ratingLabels = ['完全不同意', '不太同意', '一般', '比较同意', '完全同意']

// ──────────────────── 诊断逻辑 ────────────────────

/** 根据平均分返回等级 */
function getLevel(score: number): 'A' | 'B' | 'C' | 'D' {
  if (score >= 4.2) return 'A'
  if (score >= 3.2) return 'B'
  if (score >= 2.2) return 'C'
  return 'D'
}

/** 根据等级返回等级描述 */
function getLevelLabel(level: 'A' | 'B' | 'C' | 'D'): string {
  switch (level) {
    case 'A': return '优秀'
    case 'B': return '良好'
    case 'C': return '需加强'
    case 'D': return '急需培训'
  }
}

/** 等级对应的颜色样式 */
function getLevelColor(level: 'A' | 'B' | 'C' | 'D'): string {
  switch (level) {
    case 'A': return 'text-green-700 bg-green-50 border-green-200'
    case 'B': return 'text-blue-700 bg-blue-50 border-blue-200'
    case 'C': return 'text-amber-700 bg-amber-50 border-amber-200'
    case 'D': return 'text-red-700 bg-red-50 border-red-200'
  }
}

/** 等级对应的进度条颜色 */
function getBarColor(level: 'A' | 'B' | 'C' | 'D'): string {
  switch (level) {
    case 'A': return 'bg-green-500'
    case 'B': return 'bg-blue-500'
    case 'C': return 'bg-amber-500'
    case 'D': return 'bg-red-500'
  }
}

/** 维度评语映射 */
function getDimensionComment(dimensionId: string, level: 'A' | 'B' | 'C' | 'D'): string {
  const comments: Record<string, Record<string, string>> = {
    leadership: {
      A: '领导力发展体系成熟，管理团队能力出色，建议持续优化高潜人才梯队',
      B: '具备一定的领导力培养基础，建议加强变革领导力和战略思维训练',
      C: '管理者能力参差不齐，需要系统化的领导力发展项目',
      D: '领导力短板明显，建议优先启动管理者基础能力培训',
    },
    professional: {
      A: '专业技能储备充足，学习转化效果好，建议关注前沿技术趋势',
      B: '专业能力基本达标，建议加强实战型培训和知识转化机制',
      C: '专业技能存在缺口，需要针对性的技能提升计划',
      D: '专业能力严重不足，建议进行全面的岗位技能评估和培训',
    },
    teamwork: {
      A: '团队协作文化优秀，跨部门沟通顺畅，建议关注远程协作优化',
      B: '协作基础良好，建议加强跨部门信任建设和冲突管理培训',
      C: '部门间壁垒较明显，需要专项团队建设和沟通技巧培训',
      D: '协作能力亟待提升，建议从团队信任和基础沟通开始系统培训',
    },
    digital: {
      A: '数字化能力领先，数据驱动决策已成常态，建议探索AI深度应用',
      B: '具备基础数字化能力，建议加强数据分析和AI工具培训',
      C: '数字化转型处于起步阶段，需要全员数字素养提升计划',
      D: '数字化能力严重不足，建议优先开展数字工具基础培训',
    },
  }
  return comments[dimensionId]?.[level] ?? ''
}

/** 维度改进建议映射 */
function getDimensionSuggestions(dimensionId: string, level: 'A' | 'B' | 'C' | 'D'): string[] {
  const suggestions: Record<string, Record<string, string[]>> = {
    leadership: {
      A: ['建设高管教练项目，保持领导力持续进化', '设计继任者计划，确保管理梯队深度'],
      B: ['引入情境领导力培训，提升管理者应变能力', '建立管理者定期复盘和案例分享机制'],
      C: ['启动系统化的管理者培训项目（如新经理90天成长计划）', '引入360度反馈工具，帮助管理者认知差距'],
      D: ['优先培训管理者基础技能：目标设定、反馈、授权', '为关键管理岗位配备外部导师或教练'],
    },
    professional: {
      A: ['关注行业前沿趋势，组织对标学习', '建立内部讲师制度，促进知识沉淀'],
      B: ['设计岗位能力模型，明确技能差距', '增加实战型培训比例，如沙盘模拟、项目实战'],
      C: ['进行全面的岗位技能评估，制定个人发展计划', '引入外部专业培训，快速补齐核心技能短板'],
      D: ['对关键岗位进行紧急技能培训', '建立师徒制，加速新人和低技能员工的成长'],
    },
    teamwork: {
      A: ['优化远程和混合办公下的协作流程', '定期组织跨部门创新工作坊'],
      B: ['组织跨部门团建活动，增进非正式沟通', '培训冲突管理和非暴力沟通技巧'],
      C: ['设立跨部门项目组，打破部门壁垒', '引入协作流程和工具培训，提升协作效率'],
      D: ['从基础团队信任建设开始，如户外拓展或团队共创', '培训基本沟通技巧：倾听、反馈、表达'],
    },
    digital: {
      A: ['探索AI在业务流程中的深度应用', '培养内部数字化教练团队'],
      B: ['开展数据分析实战培训，提升数据素养', '引入AI办公工具培训，提升日常工作效率'],
      C: ['制定全员数字素养提升计划', '从高频使用场景入手，逐步推广数字工具'],
      D: ['开展基础数字工具培训（办公软件、协作工具）', '管理层需优先接受数据驱动决策的理念培训'],
    },
  }
  return suggestions[dimensionId]?.[level] ?? []
}

/** 计算诊断报告 */
function calculateReport(scores: Record<string, number>): AssessmentReport {
  const dimensionResults: DimensionResult[] = dimensions.map(dimension => {
    const questionScores = dimension.questions.map(q => scores[q.id] || 0)
    const average = questionScores.reduce((sum, s) => sum + s, 0) / questionScores.length
    const level = getLevel(average)

    return {
      dimension,
      averageScore: Math.round(average * 10) / 10,
      level,
      comment: getDimensionComment(dimension.id, level),
      suggestions: getDimensionSuggestions(dimension.id, level),
    }
  })

  const overallScore = dimensionResults.reduce((sum, r) => sum + r.averageScore, 0) / dimensionResults.length
  const roundedOverall = Math.round(overallScore * 10) / 10
  const overallLevel = getLevel(roundedOverall)

  const overallComments: Record<string, string> = {
    A: '您的企业培训体系成熟度较高，各维度均表现优秀。建议保持现有培训投入，关注前沿趋势和精细化提升。',
    B: '您的企业具备良好的培训基础，部分维度仍有提升空间。建议针对薄弱维度制定专项培训计划。',
    C: '您的企业培训体系需要加强，多个维度存在明显短板。建议系统性规划培训投入，优先补齐关键能力缺口。',
    D: '您的企业急需全面的培训提升计划。建议尽快启动核心能力培训，从基础技能和管理能力两手抓。',
  }

  return {
    dimensions: dimensionResults,
    overallScore: roundedOverall,
    overallLevel,
    overallComment: overallComments[overallLevel],
  }
}

// ──────────────────── SEO 结构化数据 ────────────────────

function buildAssessmentSchema() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        name: '企业培训需求诊断 -- TrainHub',
        description: '3分钟快速评估企业培训现状，获取专业诊断报告和改进建议，涵盖领导力、专业技能、团队协作、数字化能力四大维度',
        url: 'https://withpace.github.io/trainhub/assessment',
        isPartOf: {
          '@type': 'WebSite',
          name: 'TrainHub',
          url: 'https://withpace.github.io/trainhub/',
        },
      },
      {
        '@type': 'HowTo',
        name: '如何进行企业培训需求自评',
        description: '通过回答10个问题，快速评估企业在领导力、专业技能、团队协作、数字化能力四个维度的培训需求',
        step: [
          {
            '@type': 'HowToStep',
            position: 1,
            name: '填写评估问卷',
            text: '对10个问题进行1-5分评分，涵盖领导力发展、专业技能、团队协作和数字化能力四个维度',
          },
          {
            '@type': 'HowToStep',
            position: 2,
            name: '查看诊断报告',
            text: '系统自动生成各维度评分、等级评定和文字评语',
          },
          {
            '@type': 'HowToStep',
            position: 3,
            name: '获取改进建议',
            text: '根据诊断结果获取针对性的培训改进建议和行动方案',
          },
        ],
      },
    ],
  }
}

// ──────────────────── 分享编解码 ────────────────────

/** 将评分压缩编码为 URL-safe 字符串：按固定顺序排列分数，用单字符表示 */
function encodeScores(scores: Record<string, number>): string {
  const values = allQuestionIds.map(id => scores[id] || 0)
  return btoa(values.join(','))
}

/** 从编码字符串还原评分 */
function decodeScores(encoded: string): Record<string, number> | null {
  try {
    const values = atob(encoded).split(',').map(Number)
    if (values.length !== allQuestionIds.length || values.some(v => v < 1 || v > 5)) return null
    const scores: Record<string, number> = {}
    allQuestionIds.forEach((id, i) => { scores[id] = values[i] })
    return scores
  } catch {
    return null
  }
}

/** 生成当前结果的分享链接 */
function buildShareUrl(scores: Record<string, number>): string {
  const base = typeof window !== 'undefined'
    ? `${window.location.origin}${window.location.pathname}`
    : 'https://withpace.github.io/trainhub/assessment'
  return `${base}?r=${encodeScores(scores)}`
}

// ──────────────────── 页面组件 ────────────────────

export default function AssessmentPage() {
  // 所有评分存储：questionId -> score (1-5)
  const [scores, setScores] = useState<Record<string, number>>({})
  // 是否显示结果
  const [showResult, setShowResult] = useState(false)
  // 分享链接复制反馈
  const [copied, setCopied] = useState(false)

  // 页面加载时检查 URL 参数，自动恢复分享结果
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const encoded = params.get('r')
    if (encoded) {
      const decoded = decodeScores(encoded)
      if (decoded) {
        setScores(decoded)
        setShowResult(true)
        setTimeout(() => {
          document.getElementById('assessment-result')?.scrollIntoView({ behavior: 'smooth' })
        }, 300)
      }
    }
  }, [])

  // 是否所有问题都已作答
  const allAnswered = allQuestionIds.every(id => scores[id] !== undefined)

  // 计算诊断报告
  const report = useMemo(() => {
    if (!showResult) return null
    return calculateReport(scores)
  }, [scores, showResult])

  // 处理评分
  const handleScore = (questionId: string, score: number) => {
    setScores(prev => ({ ...prev, [questionId]: score }))
  }

  // 提交
  const handleSubmit = () => {
    if (!allAnswered) return
    setShowResult(true)
    // 滚动到结果区域
    setTimeout(() => {
      document.getElementById('assessment-result')?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  // 重新评估
  const handleReset = () => {
    setScores({})
    setShowResult(false)
    // 清除 URL 参数
    window.history.replaceState(null, '', window.location.pathname)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // 复制分享链接
  const handleCopyShareLink = useCallback(() => {
    const url = buildShareUrl(scores)
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }, [scores])

  // 分享到微信（复制文案+链接）
  const handleShareWeChat = useCallback(() => {
    if (!report) return
    const text = `我的企业培训需求诊断结果：${getLevelLabel(report.overallLevel)}（${report.overallScore}/5.0）\n` +
      `${report.dimensions.map(d => `${d.dimension.name}: ${getLevelLabel(d.level)}`).join(' | ')}\n` +
      `来测测你的企业培训水平 👉 ${buildShareUrl(scores)}`
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }, [report, scores])

  // 分享到 LinkedIn
  const shareLinkedInUrl = useMemo(() => {
    if (!showResult) return ''
    return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(buildShareUrl(scores))}`
  }, [scores, showResult])

  return (
    <div>
      <PageHead
        title="企业培训需求诊断 | TrainHub - 3分钟快速评估培训方向"
        description="3分钟快速评估企业培训现状，获取专业诊断报告和改进建议，涵盖领导力、专业技能、团队协作、数字化能力四大维度。"
        path="/assessment"
      />
      <JsonLd data={buildAssessmentSchema()} />

      {/* Hero 区域 */}
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

      {/* 问卷区域 */}
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
                  // 计算全局题号
                  const globalIndex = dimensions
                    .slice(0, dimIndex)
                    .reduce((sum, d) => sum + d.questions.length, 0) + qIndex + 1
                  const currentScore = scores[question.id]

                  return (
                    <div key={question.id} className="px-6 py-5">
                      {/* 题目 */}
                      <p className="text-sm font-medium text-gray-800">
                        <span className="mr-2 text-gray-400">{globalIndex}.</span>
                        {question.text}
                      </p>

                      {/* 评分按钮组 */}
                      <div className="mt-3">
                        {/* 移动端标签提示 */}
                        <div className="mb-2 flex justify-between text-xs text-gray-400 sm:hidden">
                          <span>完全不同意</span>
                          <span>完全同意</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {/* 桌面端左侧标签 */}
                          <span className="hidden text-xs text-gray-400 sm:block sm:w-20 sm:text-right">
                            完全不同意
                          </span>
                          {[1, 2, 3, 4, 5].map(score => (
                            <button
                              key={score}
                              type="button"
                              onClick={() => handleScore(question.id, score)}
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
                          {/* 桌面端右侧标签 */}
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

          {/* 提交按钮区域 */}
          {!showResult && (
            <div className="text-center">
              {/* 完成进度提示 */}
              <p className="mb-4 text-sm text-gray-500">
                已完成 {Object.keys(scores).length} / {allQuestionIds.length} 题
              </p>
              <button
                type="button"
                onClick={handleSubmit}
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

      {/* 诊断结果 */}
      {showResult && report && (
        <section id="assessment-result" className="bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            {/* 报告标题 */}
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900">培训需求诊断报告</h2>
              <p className="mt-2 text-gray-500">基于您的评估结果生成的专业诊断</p>
            </div>

            {/* 总体评级卡片 */}
            <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6 sm:p-8">
              <div className="flex flex-col items-center gap-6 sm:flex-row">
                {/* 等级标志 */}
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
                  {/* 维度名称和评分 */}
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

                  {/* 进度条 */}
                  <div className="mt-3 h-2.5 rounded-full bg-gray-100">
                    <div
                      className={`h-2.5 rounded-full transition-all duration-700 ${getBarColor(result.level)}`}
                      style={{ width: `${(result.averageScore / 5) * 100}%` }}
                    />
                  </div>

                  {/* 评语 */}
                  <p className="mt-3 text-sm text-gray-600">{result.comment}</p>

                  {/* 改进建议 */}
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

            {/* 分享诊断结果 */}
            <div className="mt-8 rounded-xl border border-green-200 bg-green-50 p-6 sm:p-8">
              <h3 className="text-center text-lg font-bold text-gray-900">
                分享诊断结果
              </h3>
              <p className="mt-2 text-center text-sm text-gray-500">
                邀请同事一起评估，对比各部门培训现状
              </p>
              <div className="mt-4 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                <button
                  type="button"
                  onClick={handleShareWeChat}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-green-700 sm:w-auto"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 0 1 .598.082l1.584.926a.272.272 0 0 0 .14.045c.134 0 .24-.11.24-.245 0-.06-.024-.12-.04-.178l-.325-1.233a.49.49 0 0 1 .177-.554C23.028 18.48 24 16.82 24 14.98c0-3.21-2.931-5.952-7.062-6.122zm-2.036 2.87c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.983.97-.983zm4.072 0c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.983.97-.983z"/>
                  </svg>
                  {copied ? '已复制！' : '分享到微信'}
                </button>
                <a
                  href={shareLinkedInUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 sm:w-auto"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  分享到 LinkedIn
                </a>
                <button
                  type="button"
                  onClick={handleCopyShareLink}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 sm:w-auto"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                  {copied ? '已复制！' : '复制链接'}
                </button>
              </div>
            </div>

            {/* 操作按钮区域 */}
            <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 sm:p-8">
              <h3 className="text-center text-lg font-bold text-gray-900">
                下一步行动
              </h3>
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
                  onClick={handleReset}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 sm:w-auto"
                >
                  重新评估
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 底部说明 */}
      {!showResult && (
        <section className="bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-xl font-bold text-gray-900">
              不确定如何评估？
            </h2>
            <p className="mt-2 text-gray-500">
              资深培训顾问一对一帮您分析培训需求，制定针对性方案
            </p>
            <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link
                to="/about"
                className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
              >
                联系培训顾问
              </Link>
              <Link
                to="/match"
                className="rounded-lg border border-gray-300 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                智能匹配推荐
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
