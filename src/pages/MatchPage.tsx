import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  Target,
  Users,
  Wallet,
  Clock,
  Briefcase,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Star,
  MapPin,
  CheckCircle,
} from 'lucide-react'
import { categories, trainers, courses } from '@/data/mock'
import { getAvatarUrl, cn } from '@/lib/utils'
import { JsonLd } from '@/components/seo/JsonLd'
import type { Course, Trainer } from '@/types'

// ──────────────────── 问题定义 ────────────────────

interface QuestionOption {
  label: string
  value: string
  icon?: string
}

interface Question {
  id: string
  title: string
  subtitle: string
  icon: React.ReactNode
  options: QuestionOption[]
}

const questions: Question[] = [
  {
    id: 'goal',
    title: '您希望提升哪方面的能力？',
    subtitle: '选择最核心的培训目标',
    icon: <Target className="h-6 w-6" />,
    options: categories.map(c => ({
      label: c.name,
      value: String(c.id),
      icon: c.icon,
    })),
  },
  {
    id: 'audience',
    title: '参训人员是哪类群体？',
    subtitle: '帮助我们推荐更匹配的课程',
    icon: <Briefcase className="h-6 w-6" />,
    options: [
      { label: '企业高管/VP', value: 'executive' },
      { label: '中层管理者', value: 'manager' },
      { label: '销售团队', value: 'sales' },
      { label: '技术/研发团队', value: 'tech' },
      { label: 'HR/行政团队', value: 'hr' },
      { label: '全员培训', value: 'all' },
    ],
  },
  {
    id: 'teamSize',
    title: '预计参训人数？',
    subtitle: '确保课程容量匹配',
    icon: <Users className="h-6 w-6" />,
    options: [
      { label: '20人以下', value: 'small' },
      { label: '20-30人', value: 'medium' },
      { label: '30-50人', value: 'large' },
      { label: '50人以上', value: 'xlarge' },
    ],
  },
  {
    id: 'budget',
    title: '每次培训预算范围？',
    subtitle: '含培训师课酬，不含差旅食宿',
    icon: <Wallet className="h-6 w-6" />,
    options: [
      { label: '2万元以下', value: 'low' },
      { label: '2-4万元', value: 'mid' },
      { label: '4-6万元', value: 'high' },
      { label: '6万元以上', value: 'premium' },
    ],
  },
  {
    id: 'duration',
    title: '期望的培训时长？',
    subtitle: '可根据需求灵活调整',
    icon: <Clock className="h-6 w-6" />,
    options: [
      { label: '半天（3小时）', value: 'half' },
      { label: '1天（6小时）', value: 'one' },
      { label: '2天（12小时）', value: 'two' },
    ],
  },
]

// ──────────────────── 匹配算法 ────────────────────

interface Answers {
  goal?: string
  audience?: string
  teamSize?: string
  budget?: string
  duration?: string
}

interface MatchResult {
  course: Course
  trainer: Trainer
  score: number
  reasons: string[]
}

/** 解析价格范围字符串为 [min, max] */
function parsePriceRange(range: string): [number, number] {
  const parts = range.split('-')
  return [parseInt(parts[0], 10) || 0, parseInt(parts[1], 10) || 0]
}

/** 根据预算选项获取 [min, max] */
function getBudgetRange(budget: string): [number, number] {
  switch (budget) {
    case 'low': return [0, 20000]
    case 'mid': return [20000, 40000]
    case 'high': return [40000, 60000]
    case 'premium': return [60000, Infinity]
    default: return [0, Infinity]
  }
}

/** 根据团队规模选项获取人数 */
function getTeamSize(size: string): number {
  switch (size) {
    case 'small': return 15
    case 'medium': return 25
    case 'large': return 40
    case 'xlarge': return 60
    default: return 30
  }
}

/** 培训对象关键词映射 */
const audienceKeywords: Record<string, string[]> = {
  executive: ['高管', 'CEO', 'VP', '事业部', '创始人', '总监'],
  manager: ['管理者', '经理', '新晋', '中层'],
  sales: ['销售', 'B2B', '客户'],
  tech: ['研发', '项目经理', '产品经理', '技术'],
  hr: ['HR', 'HRBP', '人才', '人力'],
  all: ['全员'],
}

/** 计算单个课程的匹配得分 */
function scoreCourse(course: Course, trainer: Trainer, answers: Answers): MatchResult {
  let totalScore = 0
  const reasons: string[] = []

  // 1. 培训目标匹配 (40%)
  if (answers.goal) {
    const goalId = parseInt(answers.goal, 10)
    if (course.category_id === goalId) {
      totalScore += 40
      reasons.push('培训领域完全匹配')
    } else {
      // 培训师的专长是否与目标分类相关
      const goalCategory = categories.find(c => c.id === goalId)
      if (goalCategory) {
        const hasRelatedSpecialty = trainer.specialties.some(s =>
          goalCategory.name.includes(s) || goalCategory.description.includes(s)
        )
        if (hasRelatedSpecialty) {
          totalScore += 15
          reasons.push('培训师专长相关')
        }
      }
    }
  }

  // 2. 预算匹配 (25%)
  if (answers.budget) {
    const [budgetMin, budgetMax] = getBudgetRange(answers.budget)
    const [priceMin, priceMax] = parsePriceRange(course.price_range)
    // 计算重叠比例
    const overlapMin = Math.max(budgetMin, priceMin)
    const overlapMax = Math.min(budgetMax, priceMax)
    if (overlapMin <= overlapMax) {
      // 有重叠
      const overlapRatio = budgetMax === Infinity
        ? 1
        : (overlapMax - overlapMin) / (budgetMax - budgetMin || 1)
      const budgetScore = Math.min(25, Math.round(overlapRatio * 25))
      totalScore += budgetScore
      if (budgetScore >= 20) reasons.push('预算范围匹配')
    }
  }

  // 3. 团队规模匹配 (15%)
  if (answers.teamSize) {
    const size = getTeamSize(answers.teamSize)
    if (course.max_participants >= size) {
      totalScore += 15
      reasons.push(`可容纳${course.max_participants}人`)
    } else if (course.max_participants >= size * 0.7) {
      totalScore += 8
    }
  }

  // 4. 培训时长匹配 (10%)
  if (answers.duration) {
    const courseDuration = course.duration.toLowerCase()
    const match =
      (answers.duration === 'half' && (courseDuration.includes('半天') || courseDuration.includes('3小时'))) ||
      (answers.duration === 'one' && courseDuration.includes('1天')) ||
      (answers.duration === 'two' && courseDuration.includes('2天'))
    if (match) {
      totalScore += 10
      reasons.push('时长匹配')
    } else {
      // 接近的也给部分分
      totalScore += 3
    }
  }

  // 5. 培训对象匹配 (10%)
  if (answers.audience) {
    const keywords = audienceKeywords[answers.audience] || []
    const audience = course.target_audience
    const matchCount = keywords.filter(kw => audience.includes(kw)).length
    if (matchCount > 0) {
      totalScore += Math.min(10, matchCount * 5)
      reasons.push('适合目标人群')
    } else if (audience.includes('全员')) {
      totalScore += 7
      reasons.push('适合全员参训')
    }
  }

  // 培训师质量加分（额外 0-5 分，不超过 100）
  const qualityBonus = Math.round((trainer.rating - 4.5) * 10 + (trainer.years_experience > 15 ? 2 : 0))
  totalScore = Math.min(100, totalScore + qualityBonus)

  return { course, trainer, score: totalScore, reasons }
}

/** 执行匹配，返回排序后的结果 */
function runMatch(answers: Answers): MatchResult[] {
  const results: MatchResult[] = []

  for (const course of courses) {
    const trainer = trainers.find(t => t.id === course.trainer_id)
    if (!trainer || trainer.status !== 'active') continue

    const result = scoreCourse(course, trainer, answers)
    if (result.score > 0) {
      results.push(result)
    }
  }

  // 按分数降序，同分按评分降序
  results.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score
    return b.trainer.rating - a.trainer.rating
  })

  return results
}

// ──────────────────── 页面组件 ────────────────────

export default function MatchPage() {
  const [step, setStep] = useState(0) // 0-4: 问题步骤, 5: 结果
  const [answers, setAnswers] = useState<Answers>({})
  const [showResults, setShowResults] = useState(false)

  const currentQuestion = questions[step]
  const totalSteps = questions.length
  const progress = showResults ? 100 : ((step) / totalSteps) * 100

  // 计算匹配结果
  const matchResults = useMemo(() => {
    if (!showResults) return []
    return runMatch(answers)
  }, [answers, showResults])

  const topResults = matchResults.slice(0, 6)

  // 选择答案
  const handleSelect = (value: string) => {
    const questionId = currentQuestion.id
    setAnswers(prev => ({ ...prev, [questionId]: value }))

    if (step < totalSteps - 1) {
      // 下一个问题
      setStep(step + 1)
    } else {
      // 所有问题回答完毕，显示结果
      setShowResults(true)
    }
  }

  // 返回上一步
  const handleBack = () => {
    if (showResults) {
      setShowResults(false)
      setStep(totalSteps - 1)
    } else if (step > 0) {
      setStep(step - 1)
    }
  }

  // 重新开始
  const handleReset = () => {
    setStep(0)
    setAnswers({})
    setShowResults(false)
  }

  return (
    <div>
      <JsonLd data={buildMatchPageSchema()} />

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 px-4 py-12 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-3xl font-bold sm:text-4xl">智能培训匹配</h1>
          <p className="mt-3 text-lg text-blue-100">
            回答 {totalSteps} 个问题，AI 为您推荐最适合的培训师和课程
          </p>
        </div>
      </section>

      {/* 进度条 */}
      <div className="mx-auto max-w-3xl px-4 pt-8 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
          <span>{showResults ? '匹配完成' : `第 ${step + 1} / ${totalSteps} 步`}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-2 rounded-full bg-gray-200">
          <div
            className="h-2 rounded-full bg-blue-600 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* 问答区域 */}
      {!showResults && currentQuestion && (
        <section className="px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            {/* 问题标题 */}
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                {currentQuestion.icon}
              </div>
              <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
                {currentQuestion.title}
              </h2>
              <p className="mt-2 text-gray-500">{currentQuestion.subtitle}</p>
            </div>

            {/* 选项 */}
            <div className={cn(
              'grid gap-3',
              currentQuestion.options.length <= 4
                ? 'grid-cols-1 sm:grid-cols-2'
                : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
            )}>
              {currentQuestion.options.map(option => {
                const isSelected = answers[currentQuestion.id as keyof Answers] === option.value
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleSelect(option.value)}
                    className={cn(
                      'flex items-center gap-3 rounded-xl border-2 px-5 py-4 text-left transition-all',
                      isSelected
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50/50'
                    )}
                  >
                    {option.icon && <span className="text-2xl">{option.icon}</span>}
                    <span className="text-base font-medium">{option.label}</span>
                    {isSelected && (
                      <CheckCircle className="ml-auto h-5 w-5 text-blue-600" />
                    )}
                  </button>
                )
              })}
            </div>

            {/* 导航按钮 */}
            <div className="mt-8 flex justify-between">
              {step > 0 ? (
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex min-h-[44px] items-center gap-2 rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  <ArrowLeft className="h-4 w-4" />
                  上一步
                </button>
              ) : (
                <div />
              )}
              {answers[currentQuestion.id as keyof Answers] && step < totalSteps - 1 && (
                <button
                  type="button"
                  onClick={() => setStep(step + 1)}
                  className="flex min-h-[44px] items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
                >
                  下一步
                  <ArrowRight className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </section>
      )}

      {/* 匹配结果 */}
      {showResults && (
        <section className="px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">
            {/* 结果标题 */}
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900">
                为您找到 {matchResults.length} 个匹配方案
              </h2>
              <p className="mt-2 text-gray-500">
                按匹配度排序，点击查看详情
              </p>
            </div>

            {/* 结果卡片 */}
            {topResults.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {topResults.map((result, index) => (
                  <MatchResultCard key={result.course.id} result={result} rank={index + 1} />
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
                <p className="text-gray-500">暂无完全匹配的结果，试试调整筛选条件</p>
              </div>
            )}

            {/* 查看更多 + 重新匹配 */}
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <button
                type="button"
                onClick={handleReset}
                className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <RotateCcw className="h-4 w-4" />
                重新匹配
              </button>
              <button
                type="button"
                onClick={handleBack}
                className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <ArrowLeft className="h-4 w-4" />
                修改上一步
              </button>
              <Link
                to="/courses"
                className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
              >
                浏览全部课程
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-xl font-bold text-gray-900">
            {showResults ? '需要更精准的推荐？' : '不确定如何选择？'}
          </h2>
          <p className="mt-2 text-gray-500">
            直接联系我们，资深顾问一对一为您推荐最佳培训方案
          </p>
          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              to="/about"
              className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
            >
              联系培训顾问
            </Link>
            <Link
              to="/trainers"
              className="rounded-lg border border-gray-300 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              浏览所有培训师
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

// ──────────────────── 结果卡片组件 ────────────────────

function MatchResultCard({ result, rank }: { result: MatchResult; rank: number }) {
  const { course, trainer, score, reasons } = result
  const avatarUrl = trainer.avatar_url || getAvatarUrl(trainer.name, trainer.id)

  // 匹配度颜色
  const scoreColor =
    score >= 80 ? 'text-green-600 bg-green-50 border-green-200' :
    score >= 60 ? 'text-blue-600 bg-blue-50 border-blue-200' :
    'text-amber-600 bg-amber-50 border-amber-200'

  const scoreLabel =
    score >= 80 ? '极佳匹配' :
    score >= 60 ? '良好匹配' :
    '基本匹配'

  // 格式化价格
  const [low, high] = course.price_range.split('-')
  const priceDisplay = `${Math.round(parseInt(low, 10) / 10000)}-${Math.round(parseInt(high, 10) / 10000)}万`

  return (
    <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-white transition-shadow hover:shadow-lg">
      {/* 排名标记 */}
      {rank <= 3 && (
        <div className={cn(
          'absolute left-0 top-0 rounded-br-lg px-3 py-1 text-xs font-bold text-white',
          rank === 1 ? 'bg-amber-500' : rank === 2 ? 'bg-gray-400' : 'bg-amber-700'
        )}>
          TOP {rank}
        </div>
      )}

      {/* 匹配度 */}
      <div className="flex items-center justify-end px-4 pt-4">
        <span className={cn('rounded-full border px-3 py-0.5 text-xs font-semibold', scoreColor)}>
          {scoreLabel} {score}%
        </span>
      </div>

      {/* 培训师信息 */}
      <div className="px-4 pt-2 pb-3">
        <div className="flex items-center gap-3 mb-3">
          <img
            src={avatarUrl}
            alt={trainer.name}
            className="h-10 w-10 rounded-full object-cover"
          />
          <div>
            <Link
              to={`/trainers/${trainer.id}`}
              className="text-sm font-semibold text-gray-900 hover:text-blue-600"
            >
              {trainer.name}
            </Link>
            <p className="text-xs text-gray-500">{trainer.title}</p>
          </div>
        </div>

        {/* 课程信息 */}
        <Link to={`/courses/${course.id}`} className="group">
          <h3 className="text-base font-bold text-gray-900 group-hover:text-blue-600">
            {course.title}
          </h3>
        </Link>
        <p className="mt-1 text-sm text-gray-500 line-clamp-2">{course.description}</p>

        {/* 元信息 */}
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 text-amber-500" />
            {trainer.rating}
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            {trainer.city}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {course.duration}
          </span>
          <span className="flex items-center gap-1">
            <Wallet className="h-3.5 w-3.5" />
            {priceDisplay}
          </span>
        </div>

        {/* 匹配原因 */}
        {reasons.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {reasons.slice(0, 3).map(reason => (
              <span
                key={reason}
                className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-0.5 text-xs text-blue-700"
              >
                <CheckCircle className="h-3 w-3" />
                {reason}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* 操作 */}
      <div className="border-t border-gray-100 px-4 py-3">
        <Link
          to={`/courses/${course.id}`}
          className="flex items-center justify-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          查看课程详情
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  )
}

// ──────────────────── SEO 结构化数据 ────────────────────

function buildMatchPageSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: '智能培训匹配 — TrainHub',
    description: '回答5个简单问题，AI智能推荐最适合您企业的培训师和课程方案',
    url: 'https://withpace.github.io/trainhub/match',
    isPartOf: {
      '@type': 'WebSite',
      name: 'TrainHub',
      url: 'https://withpace.github.io/trainhub/',
    },
  }
}
