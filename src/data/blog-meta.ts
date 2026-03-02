// 博客文章元数据（不含正文内容，用于列表页和推荐区域）
// 完整文章内容在 blog.ts 中，由文章详情页按需加载

/** 内容块类型（供详情页渲染使用） */
export interface ContentBlock {
  type: 'paragraph' | 'heading2' | 'heading3' | 'list' | 'quote' | 'table'
  text: string // 对于 list 类型，用 \n 分隔各项
}

/** 博客文章完整类型（含正文） */
export interface BlogPost {
  id: string           // URL slug
  title: string
  excerpt: string      // 摘要，100-150字
  content: ContentBlock[] // 完整文章内容
  author: string
  publishDate: string  // YYYY-MM-DD
  category: string     // 分类标签
  tags: string[]
  readTime: string     // 如 "8分钟"
  coverImage?: string
}

/** 博客文章元数据类型（不含正文，用于列表展示） */
export interface BlogPostMeta {
  id: string
  title: string
  excerpt: string
  author: string
  publishDate: string
  category: string
  tags: string[]
  readTime: string
  coverImage?: string
}

/** 所有博客文章元数据 */
export const blogPostsMeta: BlogPostMeta[] = [
  {
    id: 'enterprise-training-industry-disruption',
    title: '2026年企业培训行业变局：为什么越来越多的企业放弃了传统培训机构？',
    excerpt: '企业花3万买的培训，培训师到手只有8000。中间成本普遍占50%以上。信息不透明、采购低效、资源受限——企业培训行业正站在"去中间化"的拐点上。本文深度分析这一万亿市场的结构性矛盾与破局之道。',
    author: 'TrainHub 研究院',
    publishDate: '2026-02-20',
    category: '行业洞察',
    tags: ['企业培训', '行业趋势', '去中间化', '培训采购'],
    readTime: '12分钟',
  },
  {
    id: 'how-to-choose-ai-training-course',
    title: '企业AI培训课程怎么选？7个关键评估维度',
    excerpt: '面对市场上五花八门的AI培训课程，企业HR和培训负责人常常无从下手。本文从实战经验、课程时效性、实操环节、定制化能力等7个维度，提供一套系统化的AI培训课程评估框架。',
    author: 'TrainHub 研究院',
    publishDate: '2026-02-25',
    category: 'AI与数字化',
    tags: ['AI培训', '课程选择', '企业培训', '数字化转型'],
    readTime: '10分钟',
  },
  {
    id: 'leadership-training-trends-2026',
    title: '2026年领导力培训五大趋势：从"课堂"到"实战场"',
    excerpt: '传统的领导力课堂讲授正在被淘汰。沉浸式体验学习、AI教练、微学习混合模式、情境领导力、可量化的培训ROI——这五大趋势正在重新定义领导力发展的方式。',
    author: 'TrainHub 研究院',
    publishDate: '2026-02-28',
    category: '领导力',
    tags: ['领导力培训', '培训趋势', '管理者发展', '企业培训'],
    readTime: '8分钟',
  },
  {
    id: 'how-to-evaluate-trainer-quality',
    title: '如何评估培训师的专业能力？HR必看的5个维度',
    excerpt: '选培训师不应该像开盲盒。行业实战经验、课程大纲结构、学员评价、定制化能力、专业认证——掌握这5个评估维度，让你的每一分培训预算都花在刀刃上。',
    author: 'TrainHub 研究院',
    publishDate: '2026-03-01',
    category: '培训采购',
    tags: ['培训师评估', 'HR指南', '培训采购', '企业培训'],
    readTime: '8分钟',
  },
  {
    id: 'training-roi-measurement',
    title: '企业培训ROI怎么算？一套可落地的效果评估方法',
    excerpt: '每年花几十万甚至上百万做培训，效果到底怎么样？多数企业的回答是"感觉还行"。本文基于柯氏四级评估模型，提供一套从反应层到结果层的完整培训ROI计算方法，附公式、案例和实操模板。',
    author: 'TrainHub 研究院',
    publishDate: '2026-03-05',
    category: '培训管理',
    tags: ['培训ROI', '培训效果评估', '柯氏四级评估', '培训管理', '企业培训'],
    readTime: '10分钟',
  },
  {
    id: 'freelance-trainer-pricing-guide',
    title: '自由培训师定价指南：从日薪8000到3万的进阶路径',
    excerpt: '自由培训师最头疼的问题之一就是定价。报高了怕丢单，报低了又觉得委屈自己。本文拆解培训师定价的底层逻辑，从市场行情、价值锚点到阶梯式涨价策略，帮你找到合理且体面的价格区间。',
    author: 'TrainHub 研究院',
    publishDate: '2026-03-08',
    category: '培训师成长',
    tags: ['培训师定价', '培训师收入', '自由培训师', '培训师成长', '职业发展'],
    readTime: '10分钟',
  },
  {
    id: 'new-manager-first-90-days',
    title: '新任经理的前90天：从"我做"到"带人做"的关键转型',
    excerpt: '从优秀员工晋升为管理者，角色变了，但思维往往没跟上。前90天是新任经理最关键的窗口期——建立信任、理清团队、拿到早期成果。本文提供一套30-60-90天行动框架，帮你稳稳度过转型期。',
    author: 'TrainHub 研究院',
    publishDate: '2026-03-12',
    category: '领导力',
    tags: ['新任经理', '角色转型', '管理者培训', '领导力', '团队管理'],
    readTime: '10分钟',
  },
  {
    id: 'enterprise-training-budget-planning-2026',
    title: '2026年企业培训预算怎么做？HR必备的预算规划指南',
    excerpt: '培训预算年年做，年年被砍。问题出在哪？不是钱不够，是花钱的逻辑没讲清。本文从预算编制的底层框架到行业benchmark数据，附带预算模板和3个省钱技巧，帮HR做出一份让老板点头的培训预算。',
    author: 'TrainHub 研究院',
    publishDate: '2026-03-15',
    category: '培训管理',
    tags: ['培训预算', '培训计划', '企业培训投入', '培训管理', 'HR指南'],
    readTime: '10分钟',
  },
  {
    id: 'training-needs-analysis-methods',
    title: '企业培训需求分析方法：从"拍脑袋"到"有据可依"的完整指南',
    excerpt: '很多企业做培训的第一步就错了——老板说"搞个领导力培训"，HR就去找课程。但问题是：真的需要领导力培训吗？真正的痛点在哪里？本文介绍一套系统化的培训需求分析（TNA）方法，帮你在花钱之前先把需求搞清楚。',
    author: 'TrainHub 研究院',
    publishDate: '2026-03-18',
    category: '培训管理',
    tags: ['培训需求分析', 'TNA', '培训管理', '人才发展', '智能匹配'],
    readTime: '10分钟',
  },
  {
    id: 'digital-training-trends-2026',
    title: '2026年企业数字化培训趋势：AI 正在重塑万亿培训市场',
    excerpt: '2026年是企业培训数字化的分水岭。AI不再是"未来趋势"，而是正在改变培训的每个环节——从需求分析到内容生成，从培训交付到效果评估。本文分析6大关键趋势，帮企业抓住数字化培训的窗口期。',
    author: 'TrainHub 研究院',
    publishDate: '2026-03-20',
    category: '行业洞察',
    tags: ['数字化培训', 'AI培训', 'AIGC', '企业培训趋势', '数字化转型'],
    readTime: '11分钟',
  },
  {
    id: 'annual-training-plan-design',
    title: '如何设计企业年度培训计划：HR 必读的 7 步实操框架',
    excerpt: '每年Q4，HR都要交一份年度培训计划。但大多数计划的命运是：写完就锁进抽屉，执行时跟计划完全两回事。本文提供一套经过验证的7步框架，帮你设计出真正能落地的年度培训计划。',
    author: 'TrainHub 研究院',
    publishDate: '2026-03-22',
    category: '培训管理',
    tags: ['年度培训计划', 'HR', '培训管理', '培训规划', '人才发展'],
    readTime: '12分钟',
  },
  {
    id: 'online-vs-offline-training',
    title: '线上 vs 线下培训：不是选择题，而是组合题',
    excerpt: '线上培训便宜灵活但互动差，线下培训深入有效但成本高——这种非此即彼的讨论该结束了。2026年最聪明的企业已经找到了正确答案：混合式培训。本文用数据对比两种形式的优劣，帮你在每种场景下做出最优选择。',
    author: 'TrainHub 研究院',
    publishDate: '2026-03-25',
    category: '培训管理',
    tags: ['线上培训', '线下培训', '混合式培训', '培训形式', '企业培训'],
    readTime: '9分钟',
  },
  {
    id: 'training-effectiveness-evaluation',
    title: '企业培训效果评估最佳实践：柯氏四级模型深度解析与实操指南',
    excerpt: '老板问"上次那个培训有没有效果？"你只能拿出一张满意度评分表。这种窘境，90%的HR和培训经理都经历过。本文深度解析柯氏四级评估模型，从反应到结果，给你一套完整的培训效果评估方法论和实操工具。',
    author: 'TrainHub 研究院',
    publishDate: '2026-03-28',
    category: '培训管理',
    tags: ['培训效果评估', '柯氏四级模型', 'ROI', '培训管理', '绩效改进'],
    readTime: '13分钟',
  },
  {
    id: 'how-to-choose-training-provider',
    title: '2026年企业培训机构选型指南：避开5个常见陷阱，找到真正合适的供应商',
    excerpt: '80%的企业培训采购决策靠"关系推荐"而非系统评估。选错供应商的代价不只是浪费预算，更是错失团队成长的关键窗口。本文提供一套实战检验过的选型决策框架，帮你在鱼龙混杂的培训市场找到真正靠谱的合作伙伴。',
    author: 'TrainHub 研究院',
    publishDate: '2026-03-02',
    category: '实操指南',
    tags: ['企业培训', '培训采购', '培训机构', '供应商选择'],
    readTime: '10分钟',
  },
  {
    id: 'new-employee-onboarding-training-guide',
    title: '新员工入职培训方案全攻略：从第1天到第90天的落地框架',
    excerpt: '研究显示，系统化入职培训可以将新员工3个月留存率提升82%，首年离职率降低50%。但超过60%的企业仍停留在"签合同、发电脑、看PPT"的原始阶段。本文提供一套经过验证的90天入职培训落地框架，从第1天到第90天全覆盖。',
    author: 'TrainHub 研究院',
    publishDate: '2026-03-02',
    category: '实操指南',
    tags: ['新员工培训', '入职培训', 'Onboarding', '培训方案'],
    readTime: '10分钟',
  },
  {
    id: 'how-to-build-internal-training-system',
    title: '企业内训体系从0到1搭建指南：不花冤枉钱的实战方法论',
    excerpt: '80%的企业每年在外训上花费数十万甚至上百万，却忽略了一个事实：内训体系一旦搭建完成，边际成本趋近于零。本文从内训与外训的本质差异出发，提供一套经过验证的内训体系搭建路径，帮助HR总监和培训经理用最小成本构建可持续的学习型组织。',
    author: 'TrainHub 研究院',
    publishDate: '2026-03-02',
    category: '实操指南',
    tags: ['企业内训', '内训体系', '培训体系搭建', '内训师培养', '培训管理'],
    readTime: '10分钟',
  },
  {
    id: 'middle-management-training-courses',
    title: '中层管理者培训课程全指南：从"技术骨干"到"合格管理者"的关键跨越',
    excerpt: '调查显示，60%的新晋中层管理者在上任后18个月内表现不达预期，核心原因不是能力不行，而是没有完成从"做事"到"管人"的角色转变。本文系统梳理中层管理者的四大能力短板，并提供一套完整的课程体系设计方案和选课建议。',
    author: 'TrainHub 研究院',
    publishDate: '2026-03-02',
    category: '课程推荐',
    tags: ['中层管理', '管理培训', '领导力', '课程推荐', '管理者转型'],
    readTime: '11分钟',
  },
  {
    id: 'team-building-training-program',
    title: '2026年团队建设培训方案设计：告别"走过场"，打造真正有效的团建培训',
    excerpt: '一项对1200家企业的调研显示，73%的员工认为公司的团建活动"浪费时间"，但同时89%的人认为团队凝聚力对工作非常重要。问题不在于团建本身，而在于大多数企业的团建方案设计严重脱离了"建设团队"的初衷。本文提供一套真正有效的团建培训方案设计框架。',
    author: 'TrainHub 研究院',
    publishDate: '2026-03-02',
    category: '实操指南',
    tags: ['团队建设', '团建培训', '团队管理', '培训方案', '团队凝聚力'],
    readTime: '10分钟',
  },
  {
    id: 'sales-team-training-program',
    title: '销售团队培训方案设计：从"鸡血式"培训到系统化能力建设',
    excerpt: '超过70%的销售培训预算被浪费在了"喊口号""打鸡血"式的激励课程上，而销售团队真正缺的是一套系统化的能力建设体系。本文从销售培训的四大痛点出发，提供一套从能力模型到课程设计再到效果衡量的完整解决方案。',
    author: 'TrainHub 研究院',
    publishDate: '2026-03-02',
    category: '实操指南',
    tags: ['销售培训', '销售团队', '能力建设', '培训方案', '销售管理'],
    readTime: '11分钟',
  },
  {
    id: 'how-to-choose-training-platform',
    title: '企业培训平台选型指南：10个关键评估维度帮你避开90%的坑',
    excerpt: '企业培训数字化已是大势所趋，但面对市面上200多个培训平台，HR和CTO们往往陷入选择困难症。60%的企业在首次选型中踩坑，导致几十万甚至上百万的沉没成本。本文提供一套系统化的选型评估框架，用10个关键维度帮你做出正确选择。',
    author: 'TrainHub 研究院',
    publishDate: '2026-03-02',
    category: '采购指南',
    tags: ['培训平台', '数字化培训', '企业采购', '培训系统', '选型指南'],
    readTime: '12分钟',
  },
  {
    id: 'manufacturing-training-program-design',
    title: '制造业培训方案设计：从一线操作工到车间主任的系统化培养路径',
    excerpt: '制造业员工培训长期停留在"师傅带徒弟"的经验模式，标准化程度低、人才断层严重。本文基于多家制造业企业的实践案例，提供从一线操作工到班组长再到车间主任的三级培养路径设计，帮助制造业HR构建可复制的人才梯队。',
    author: 'TrainHub 研究院',
    publishDate: '2026-03-02',
    category: '行业方案',
    tags: ['制造业培训', '人才梯队', '技能培训', '班组长培养', '行业方案'],
    readTime: '11分钟',
  },
  {
    id: 'corporate-learning-map-guide',
    title: '如何搭建企业学习地图：从岗位能力模型到培训路径的完整指南',
    excerpt: '90%的企业培训是"头痛医头"——缺什么补什么，没有系统规划。学习地图是解决这个问题的核武器：它将岗位能力要求、员工当前水平和培训资源三者精准对接，让每个人都有清晰的成长路径。本文提供一套从0到1的学习地图搭建方法论。',
    author: 'TrainHub 研究院',
    publishDate: '2026-03-02',
    category: '培训管理',
    tags: ['学习地图', '能力模型', '人才发展', '培训体系', '培训管理'],
    readTime: '12分钟',
  },
  {
    id: 'why-training-fails-solutions',
    title: '企业培训效果差的7个常见原因及解决方案',
    excerpt: '每年花几十万做培训，员工却觉得"浪费时间"，老板觉得"看不到效果"。培训效果差不是偶然，背后有7个系统性原因：需求诊断缺失、讲师匹配失误、内容脱离业务、缺乏实践设计、忽视学习转化、评估形同虚设、管理层不参与。本文逐一拆解并给出可落地的解决方案。',
    author: 'TrainHub 研究院',
    publishDate: '2026-03-02',
    category: '培训管理',
    tags: ['培训效果', '培训失败', '培训改进', '学习转化', '培训管理'],
    readTime: '10分钟',
  },
  {
    id: 'finance-industry-training-program',
    title: '金融行业培训方案设计：从合规培训到业务能力的系统化解决方案',
    excerpt: '金融行业培训不是"选修课"——反洗钱培训漏了要罚款，投顾资质过期要停业。但多数金融机构的培训体系仍停留在"应付监管"阶段，业务能力培训严重不足。本文基于银行、证券、保险三大领域的实践经验，提供一套从合规底线到业务能力提升的系统化培训方案设计框架。',
    author: 'TrainHub 研究院',
    publishDate: '2026-03-02',
    category: '行业方案',
    tags: ['金融培训', '合规培训', '银行培训', '行业方案', '金融业人才发展'],
    readTime: '11分钟',
  },
  {
    id: 'healthcare-training-compliance-guide',
    title: '医疗行业培训合规指南：从法规要求到落地执行的完整路径',
    excerpt: '医疗行业的培训不仅是提升能力，更关乎患者安全和法规合规。三基三严考核、继续医学教育学分、JCI认证培训——每一项都有明确的法规要求和考核标准。本文系统梳理医疗行业培训的合规要求，并提供一套从法规解读到落地执行的完整路径，帮助医院培训科和HR高效完成培训管理。',
    author: 'TrainHub 研究院',
    publishDate: '2026-03-02',
    category: '行业方案',
    tags: ['医疗培训', '合规培训', '医院培训', '行业方案', '医疗人才发展'],
    readTime: '11分钟',
  },
  {
    id: 'annual-training-summary-report-template',
    title: '年度培训总结报告怎么写？附完整模板和5个高分范例要素',
    excerpt: '每年年底，HR和培训经理最头疼的事之一就是写年度培训总结报告。写成流水账老板不看，写得太简单又显得没干什么。本文拆解培训总结报告的5个核心模块，提供可直接套用的数据模板，并分享5个让报告脱颖而出的实战技巧。',
    author: 'TrainHub 研究院',
    publishDate: '2026-03-02',
    category: '实操指南',
    tags: ['培训总结', '培训报告', '年度总结', '培训管理', 'HR工具'],
    readTime: '10分钟',
  },
  {
    id: 'retail-industry-training-program',
    title: '零售行业培训方案设计：从一线导购到店长的系统化人才培养路径',
    excerpt: '零售行业员工流动率高达60%以上，培训投入常常"还没回本人就走了"。但放弃培训只会让流动率更高。本文从零售业的独特挑战出发，提供从一线导购到店长的三级培养路径，帮助零售企业用最小成本构建可复制的门店人才梯队。',
    author: 'TrainHub 研究院',
    publishDate: '2026-03-02',
    category: '行业方案',
    tags: ['零售培训', '门店培训', '导购培训', '行业方案', '零售业人才发展'],
    readTime: '11分钟',
  },
  {
    id: 'training-needs-survey-template',
    title: '培训需求调研问卷模板：附完整题库和数据分析方法',
    excerpt: '培训需求调研是培训工作的第一步，但多数企业的调研问卷要么太笼统、要么太冗长，收回来的数据根本没法用。本文提供一套经过验证的培训需求调研问卷模板，含管理层版、员工版和部门经理版三个版本，附数据分析方法和常见坑点。',
    author: 'TrainHub 研究院',
    publishDate: '2026-03-02',
    category: '实操指南',
    tags: ['培训需求调研', '问卷模板', '需求分析', '培训管理', 'HR工具'],
    readTime: '10分钟',
  },
  {
    id: 'it-industry-tech-training-program',
    title: 'IT行业技术培训方案设计：从初级开发到技术管理者的成长路径',
    excerpt: '技术知识的半衰期只有2.5年，今天学的框架明年可能就过时了。IT行业的培训不是"学一次管一辈子"，而是"不学就淘汰"的持续战争。本文从技术迭代快、人才竞争烈、管理转型难三大痛点出发，提供IT企业从初级开发到技术管理者的系统化培养方案。',
    author: 'TrainHub 研究院',
    publishDate: '2026-03-02',
    category: '行业方案',
    tags: ['IT培训', '技术培训', '程序员培训', '行业方案', 'IT人才发展'],
    readTime: '11分钟',
  },
  {
    id: 'education-industry-training-program',
    title: '教育行业培训方案设计：从教师专业发展到教育管理者的系统化培养路径',
    excerpt: '教育行业面临"双减"后转型、数字化教学、新课标落地三大挑战，但80%的教师培训还停留在"听讲座、写心得"阶段。本文基于K12学校、高等院校和职业教育机构的实践经验，提供从一线教师到学科带头人再到教育管理者的三级培养路径设计框架。',
    author: 'TrainHub 研究院',
    publishDate: '2026-03-02',
    category: '行业方案',
    tags: ['教育培训', '教师培训', '教育管理', '行业方案', '教育行业人才发展'],
    readTime: '11分钟',
  },
  {
    id: 'trainer-evaluation-form-template',
    title: '培训师评估表模板：附5维评分体系和3套可直接使用的评估工具',
    excerpt: '选培训师靠感觉，评培训师靠印象——这是多数企业的培训采购现状。本文提供一套经过验证的5维评分评估体系，附培训前评估表、培训中观察表、培训后反馈表三套可直接下载使用的模板，帮HR和培训经理用数据说话，告别"凭感觉"。',
    author: 'TrainHub 研究院',
    publishDate: '2026-03-02',
    category: '实操指南',
    tags: ['培训师评估', '评估表模板', '培训采购', 'HR工具', '培训管理'],
    readTime: '10分钟',
  },
  {
    id: 'logistics-industry-training-program',
    title: '物流行业培训方案设计：从仓储操作到供应链管理的全链条人才培养',
    excerpt: '物流行业年增速超过10%，但一线操作人员流动率高达70%，中层管理人才断层严重。培训不是奢侈品，而是降低人员流失和运营事故的必需品。本文从仓储、运输、供应链三大业务线出发，提供物流企业从一线操作工到供应链管理者的系统化培养方案。',
    author: 'TrainHub 研究院',
    publishDate: '2026-03-02',
    category: '行业方案',
    tags: ['物流培训', '供应链培训', '仓储培训', '行业方案', '物流人才发展'],
    readTime: '11分钟',
  },
]

/** 根据 slug 获取文章元数据 */
export function getBlogPostMetaBySlug(slug: string): BlogPostMeta | undefined {
  return blogPostsMeta.find(post => post.id === slug)
}

/** 获取相关文章元数据（同分类，排除当前文章） */
export function getRelatedPostsMeta(currentSlug: string, limit = 3): BlogPostMeta[] {
  const current = getBlogPostMetaBySlug(currentSlug)
  if (!current) return blogPostsMeta.slice(0, limit)

  const sameCategoryPosts = blogPostsMeta.filter(
    post => post.id !== currentSlug && post.category === current.category
  )

  // 同分类不够时补充其他文章
  if (sameCategoryPosts.length >= limit) {
    return sameCategoryPosts.slice(0, limit)
  }

  const otherPosts = blogPostsMeta.filter(
    post => post.id !== currentSlug && post.category !== current.category
  )

  return [...sameCategoryPosts, ...otherPosts].slice(0, limit)
}
