// ──────────────────── 类型定义 ────────────────────

/** 评估维度 */
export interface Dimension {
  id: string
  name: string
  description: string
  questions: AssessmentQuestion[]
}

/** 单个评估问题 */
export interface AssessmentQuestion {
  id: string
  text: string
}

/** 各维度诊断结果 */
export interface DimensionResult {
  dimension: Dimension
  averageScore: number
  level: 'A' | 'B' | 'C' | 'D'
  comment: string
  suggestions: string[]
}

/** 整体诊断报告 */
export interface AssessmentReport {
  dimensions: DimensionResult[]
  overallScore: number
  overallLevel: 'A' | 'B' | 'C' | 'D'
  overallComment: string
}

// ──────────────────── 问卷数据 ────────────────────

export const dimensions: Dimension[] = [
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

/** 所有问题的 id 列表，用于校验是否全部作答 */
export const allQuestionIds = dimensions.flatMap(d => d.questions.map(q => q.id))

/** 评分选项标签 */
export const ratingLabels = ['完全不同意', '不太同意', '一般', '比较同意', '完全同意']

// ──────────────────── 诊断逻辑 ────────────────────

/** 根据平均分返回等级 */
export function getLevel(score: number): 'A' | 'B' | 'C' | 'D' {
  if (score >= 4.2) return 'A'
  if (score >= 3.2) return 'B'
  if (score >= 2.2) return 'C'
  return 'D'
}

/** 根据等级返回等级描述 */
export function getLevelLabel(level: 'A' | 'B' | 'C' | 'D'): string {
  switch (level) {
    case 'A': return '优秀'
    case 'B': return '良好'
    case 'C': return '需加强'
    case 'D': return '急需培训'
  }
}

/** 等级对应的颜色样式 */
export function getLevelColor(level: 'A' | 'B' | 'C' | 'D'): string {
  switch (level) {
    case 'A': return 'text-green-700 bg-green-50 border-green-200'
    case 'B': return 'text-blue-700 bg-blue-50 border-blue-200'
    case 'C': return 'text-amber-700 bg-amber-50 border-amber-200'
    case 'D': return 'text-red-700 bg-red-50 border-red-200'
  }
}

/** 等级对应的进度条颜色 */
export function getBarColor(level: 'A' | 'B' | 'C' | 'D'): string {
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
export function calculateReport(scores: Record<string, number>): AssessmentReport {
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
