import type { Review } from '@/types'

// 模拟评价数据 — 每个培训师 2-3 条评价
export const reviews: Review[] = [
  // 张明远 (id: 1)
  { id: 1, trainer_id: 1, course_id: 1, author: '王总监', company: '某上市科技公司', role: '运营总监', rating: 5, content: '张老师的领导力课程非常实战，不是空洞的理论。两天下来，我们管理团队的沟通效率明显提升，尤其是教练式辅导的部分，回去就用上了。', date: '2026-02-15' },
  { id: 2, trainer_id: 1, course_id: 7, author: '李经理', company: '某互联网公司', role: '产品经理', rating: 5, content: '作为新晋管理者，这门课帮我理清了角色转变的关键点。90天行动计划模板特别实用，现在团队管理顺畅多了。', date: '2026-01-20' },
  { id: 3, trainer_id: 1, author: '赵HR', company: '某制造业集团', role: 'HRBP', rating: 4, content: '连续三年请张老师来做内训，每次都有新内容和案例更新。学员满意度一直在95%以上。', date: '2025-12-10' },

  // 李静雯 (id: 2)
  { id: 4, trainer_id: 2, course_id: 2, author: '陈总', company: '某医疗器械公司', role: '销售VP', rating: 5, content: '李老师的顾问式销售课程彻底改变了我们团队的销售方式。从推产品变成了帮客户解决问题，季度业绩提升了30%。', date: '2026-02-08' },
  { id: 5, trainer_id: 2, course_id: 2, author: '张销售', company: '某SaaS公司', role: '大客户经理', rating: 5, content: 'SPIN提问法太好用了，以前总是急着介绍产品，现在学会先挖需求。上个月签了两个大单，都是用课上学的方法。', date: '2026-01-15' },

  // 王思远 (id: 3)
  { id: 6, trainer_id: 3, course_id: 3, author: '刘CTO', company: '某传统零售企业', role: 'CTO', rating: 5, content: '王老师把复杂的AI概念讲得通俗易懂，管理层终于理解了数字化转型不是买系统，而是改变思维方式。', date: '2026-02-20' },
  { id: 7, trainer_id: 3, course_id: 8, author: '周主管', company: '某金融公司', role: '运营主管', rating: 4, content: 'AI工作坊很实用，团队成员当场就学会了用AI写报告和分析数据。现在每周至少节省10小时重复工作。', date: '2026-01-28' },

  // 陈晓华 (id: 4)
  { id: 8, trainer_id: 4, course_id: 4, author: '孙HRD', company: '某快消品集团', role: 'HRD', rating: 5, content: '人才盘点做了很多年，但一直不够系统。陈老师的九宫格方法论帮我们建立了完整的人才管理体系。', date: '2026-02-01' },
  { id: 9, trainer_id: 4, course_id: 4, author: '马经理', company: '某科技公司', role: 'HRBP经理', rating: 4, content: '继任计划的部分特别有价值，帮我们识别了关键岗位的人才风险，老板非常认可。', date: '2025-11-20' },

  // 赵雅琴 (id: 6)
  { id: 10, trainer_id: 6, course_id: 6, author: '林总监', company: '某广告公司', role: '创意总监', rating: 5, content: '赵老师的即兴戏剧式培训太有趣了！团队从抗拒培训变成主动要求加课。跨部门沟通问题改善了很多。', date: '2026-02-12' },
  { id: 11, trainer_id: 6, course_id: 6, author: '黄经理', company: '某咨询公司', role: '项目经理', rating: 5, content: '这是我参加过最不像培训的培训，在游戏和互动中就把沟通技巧学会了。向上汇报的部分对我帮助最大。', date: '2026-01-05' },

  // 林小芳 (id: 8)
  { id: 12, trainer_id: 8, course_id: 10, author: '吴总', company: '某地产公司', role: '行政副总', rating: 5, content: '全员AI培训效果超预期，连50多岁的老员工都学会了用AI写方案。林老师的耐心和教学方法值得点赞。', date: '2026-02-25' },
  { id: 13, trainer_id: 8, course_id: 10, author: '钱主管', company: '某银行', role: '培训主管', rating: 5, content: '我们银行对合规要求很高，林老师专门针对金融行业定制了AI使用规范，非常专业。', date: '2026-02-18' },

  // 吴晓燕 (id: 10)
  { id: 14, trainer_id: 10, course_id: 12, author: '郑经理', company: '某互联网公司', role: '客服经理', rating: 5, content: '客服团队压力大、流失率高，吴老师的情绪管理课帮大家学会了自我调节。培训后三个月离职率降了一半。', date: '2026-01-30' },
  { id: 15, trainer_id: 10, course_id: 12, author: '冯总监', company: '某会计师事务所', role: '审计总监', rating: 4, content: '审计旺季团队压力极大，正念冥想的部分很实用。现在每天早上团队会花5分钟做呼吸练习。', date: '2025-12-20' },

  // ── 第二批评价：补充覆盖所有培训师 ──

  // 张明远 (id: 1) — 补充
  { id: 16, trainer_id: 1, course_id: 1, author: '钱副总', company: '某新能源汽车公司', role: '运营副总裁', rating: 5, content: '我们连续两年采购张老师的领导力课程，每次都能根据我们的业务变化调整案例。今年加入了AI时代管理者的新模块，非常与时俱进。', date: '2026-02-28' },
  { id: 17, trainer_id: 1, course_id: 7, author: '何HRBP', company: '某跨国药企', role: 'HRBP', rating: 5, content: '新任经理90天课程是我们管培生项目的标配。张老师的"从专家到管理者"框架帮助很多技术骨干顺利转型。', date: '2026-01-08' },

  // 李静雯 (id: 2) — 补充
  { id: 18, trainer_id: 2, course_id: 2, author: '吴总监', company: '某工业自动化公司', role: '销售总监', rating: 5, content: '李老师的课最大特点是实战。不是PPT讲理论，而是真的拿我们的客户案例做角色扮演。团队反馈"终于上了一门有用的销售课"。', date: '2026-02-22' },
  { id: 19, trainer_id: 2, course_id: 2, author: '郭经理', company: '某企业服务SaaS', role: '区域销售经理', rating: 4, content: '顾问式销售的方法论很系统，SPIN提问法和价值主张画布是两个最实用的工具。建议增加更多行业定制案例。', date: '2025-12-28' },

  // 王思远 (id: 3) — 补充
  { id: 20, trainer_id: 3, course_id: 8, author: '谢总', company: '某连锁餐饮集团', role: 'CEO', rating: 5, content: '王老师帮我们全员做了AI应用培训，从前台到后厨都学会了用AI工具。现在菜单设计、供应链分析都用上了，效率提升肉眼可见。', date: '2026-03-01' },
  { id: 21, trainer_id: 3, course_id: 3, author: '范CIO', company: '某物流公司', role: 'CIO', rating: 5, content: '数字化转型路线图工作坊帮我们理清了优先级。以前什么都想做，现在聚焦三个核心场景，半年内就看到了ROI。', date: '2026-02-05' },

  // 陈晓华 (id: 4) — 补充
  { id: 22, trainer_id: 4, course_id: 4, author: '唐HRD', company: '某互联网教育公司', role: 'HRD', rating: 5, content: '陈老师的人才盘点方法论非常落地。九宫格不是画完就完了，她会教你怎么跟业务leader沟通结果、制定IDP。这才是最难的部分。', date: '2026-02-10' },
  { id: 23, trainer_id: 4, course_id: 4, author: '蒋经理', company: '某制药公司', role: 'OD经理', rating: 4, content: '继任计划的部分对我们帮助很大，识别出了3个关键岗位的人才风险。已经启动了针对性的培养计划。', date: '2026-01-18' },

  // 刘建国 (id: 5) — 新增（之前0条）
  { id: 24, trainer_id: 5, course_id: 5, author: '秦总监', company: '某电商公司', role: '运营总监', rating: 5, content: '以前看财务报表就头疼，刘老师用电商的实际案例讲解，终于搞懂了毛利率、现金流这些概念。现在跟CFO开会不再一脸懵了。', date: '2026-02-15' },
  { id: 25, trainer_id: 5, course_id: 5, author: '韩经理', company: '某制造业公司', role: '生产经理', rating: 4, content: '非财课程很实用，尤其是成本分析和预算编制的部分。回去就用学到的方法优化了部门预算，老板很满意。', date: '2026-01-25' },
  { id: 26, trainer_id: 5, course_id: 5, author: '曹VP', company: '某科技创业公司', role: '产品VP', rating: 5, content: '创业公司的产品负责人必须懂财务。刘老师的课帮我建立了基本的财务思维，现在做产品决策会先算账了。', date: '2025-12-15' },

  // 赵雅琴 (id: 6) — 补充
  { id: 27, trainer_id: 6, course_id: 6, author: '许HR', company: '某游戏公司', role: '培训经理', rating: 5, content: '赵老师的课是我们公司满意度最高的培训，没有之一。即兴戏剧的形式让程序员们都放下了手机，全程参与。', date: '2026-02-18' },
  { id: 28, trainer_id: 6, course_id: 6, author: '邓总', company: '某咨询公司', role: '合伙人', rating: 5, content: '请赵老师给我们做了两期沟通培训，第一期给顾问团队，第二期给合伙人。效果都很好，尤其是冲突管理的部分。', date: '2026-01-12' },

  // 孙伟 (id: 7) — 新增（之前0条）
  { id: 29, trainer_id: 7, course_id: 9, author: '丁CEO', company: '某智能硬件公司', role: 'CEO', rating: 5, content: '孙老师的战略工作坊帮我们找到了第二增长曲线。从纯硬件转向"硬件+服务"模式，半年内服务收入占比从5%提升到20%。', date: '2026-02-20' },
  { id: 30, trainer_id: 7, course_id: 9, author: '沈总监', company: '某消费品公司', role: '战略总监', rating: 4, content: '增长飞轮的框架很有启发，帮我们理清了获客-留存-变现的闭环逻辑。建议增加更多中国市场的案例。', date: '2026-01-30' },
  { id: 31, trainer_id: 7, course_id: 9, author: '彭VP', company: '某B2B平台', role: '业务VP', rating: 5, content: '两天的战略工作坊比我们内部讨论三个月还有效。孙老师的麦肯锡方法论加上创业实战经验，组合拳很厉害。', date: '2025-11-28' },

  // 林小芳 (id: 8) — 补充
  { id: 32, trainer_id: 8, course_id: 10, author: '姚主任', company: '某国企', role: '信息化主任', rating: 5, content: '国企推AI培训阻力很大，林老师用"不是替代你，是帮你"的角度切入，老员工接受度很高。现在全公司都在用AI写报告。', date: '2026-02-12' },
  { id: 33, trainer_id: 8, course_id: 10, author: '魏经理', company: '某保险公司', role: '培训经理', rating: 4, content: 'AIGC培训效果超预期，尤其是AI写营销文案的部分，业务团队反馈产出效率提升了3倍。希望能有进阶课程。', date: '2026-01-22' },

  // 周明德 (id: 9) — 新增（之前0条）
  { id: 34, trainer_id: 9, course_id: 11, author: '方CTO', company: '某金融科技公司', role: 'CTO', rating: 5, content: '我们从瀑布转敏捷转了两年没成功，周老师来了两天就帮我们理清了问题。不是方法不对，是组织结构没调整。', date: '2026-02-08' },
  { id: 35, trainer_id: 9, course_id: 11, author: '崔PM', company: '某电商平台', role: '产品总监', rating: 5, content: '敏捷项目管理课程非常实战，Sprint规划和回顾会议的模板直接拿来就能用。团队交付速度提升了40%。', date: '2026-01-15' },
  { id: 36, trainer_id: 9, course_id: 11, author: '潘经理', company: '某软件公司', role: '项目经理', rating: 4, content: '周老师的PMP+敏捷双视角很独特，帮我们找到了适合自己的"混合敏捷"模式，不是照搬Scrum而是因地制宜。', date: '2025-12-05' },

  // 吴晓燕 (id: 10) — 补充
  { id: 37, trainer_id: 10, course_id: 12, author: '夏HR', company: '某律师事务所', role: 'HR总监', rating: 5, content: '律师行业压力大、加班多，吴老师的情绪管理课帮大家建立了自我觉察的习惯。培训后员工满意度调查提升了15个百分点。', date: '2026-02-25' },
  { id: 38, trainer_id: 10, course_id: 12, author: '田主管', company: '某医院', role: '护理部主管', rating: 5, content: '医护人员的情绪管理太重要了。吴老师的正念练习简单易学，现在科室每天交班前都会做3分钟呼吸练习。', date: '2026-01-10' },

  // ── 第三批评价：新增培训师 ──

  // 黄志豪 (id: 11)
  { id: 39, trainer_id: 11, course_id: 13, author: '罗VP', company: '某央企制造集团', role: '战略发展VP', rating: 5, content: '集团并购后整合困难重重，黄老师的变革管理方法论帮我们理清了利益相关者地图，制定了分阶段推进方案。半年内组织融合度提升了60%。', date: '2026-02-18' },
  { id: 40, trainer_id: 11, course_id: 13, author: '苏HRD', company: '某零售连锁企业', role: 'HRD', rating: 4, content: '数字化转型导致组织变革阻力很大，黄老师教的"变革沟通三步法"非常管用。员工从抵触变成了主动参与。', date: '2026-01-22' },

  // 程雪梅 (id: 12)
  { id: 41, trainer_id: 12, course_id: 14, author: '高总监', company: '某德资汽车零部件公司', role: '中国区运营总监', rating: 5, content: '程老师的跨文化沟通课帮我们中方团队理解了德国总部的决策逻辑。以前经常因为邮件风格产生误解，现在沟通效率大幅提升。', date: '2026-02-10' },
  { id: 42, trainer_id: 12, course_id: 14, author: '叶经理', company: '某出海电商公司', role: '海外市场经理', rating: 5, content: '公司拓展东南亚市场，程老师专门针对中国-东南亚文化差异做了定制课程。团队在跨文化谈判中的表现明显提升。', date: '2026-01-28' },

  // 马俊杰 (id: 13)
  { id: 43, trainer_id: 13, course_id: 15, author: '董厂长', company: '某家电制造公司', role: '工厂厂长', rating: 5, content: '马老师的精益管理课非常落地，不是纸上谈兵。价值流图分析当场就帮我们找出了三个关键浪费点，预计年节省成本200万。', date: '2026-02-20' },
  { id: 44, trainer_id: 13, course_id: 15, author: '严总监', company: '某食品加工企业', role: '供应链总监', rating: 4, content: '库存优化的部分对我们帮助最大，用马老师教的ABC分析法和安全库存模型，库存周转率提升了30%。', date: '2026-01-15' },

  // 杨芳 (id: 14)
  { id: 45, trainer_id: 14, course_id: 16, author: '任总监', company: '某美妆品牌', role: '市场总监', rating: 5, content: '杨老师的新媒体课太实战了，当天下午就带着团队拍了第一条短视频。一个月后抖音账号粉丝从0涨到5万，带来了实实在在的销售转化。', date: '2026-02-25' },
  { id: 46, trainer_id: 14, course_id: 16, author: '贺经理', company: '某连锁餐饮品牌', role: '品牌经理', rating: 5, content: '私域流量体系搭建的部分是最大收获。按杨老师的方法建了企业微信社群，三个月沉淀了2万精准用户，复购率翻倍。', date: '2026-02-08' },
  { id: 47, trainer_id: 14, course_id: 16, author: '石主管', company: '某教育培训机构', role: '新媒体主管', rating: 4, content: '杨老师对抖音算法的理解非常深，教的"3秒钩子"技巧让我们的视频完播率从15%提升到45%。课程节奏紧凑，干货满满。', date: '2026-01-05' },

  // 许文博 (id: 15)
  { id: 48, trainer_id: 15, course_id: 17, author: '卢CEO', company: '某科技创业公司', role: 'CEO', rating: 5, content: '许老师的教练式领导力课改变了我的管理方式。以前什么都亲力亲为，现在学会了用提问代替指令，团队反而更有主动性了。', date: '2026-02-15' },
  { id: 49, trainer_id: 15, course_id: 17, author: '段VP', company: '某上市地产公司', role: '人力资源VP', rating: 5, content: 'GROW教练对话模型特别实用，我们把它融入了季度绩效面谈流程。高管反馈"终于知道怎么跟下属谈发展了"。', date: '2026-01-20' },

  // ── 第四批评价：新增培训师 ──

  // 韩志强 (id: 16)
  { id: 50, trainer_id: 16, course_id: 18, author: '邓经理', company: '某IT系统集成商', role: '项目管理部经理', rating: 5, content: '韩老师的PMP课程最大优点是接地气。不是照搬PMBOK理论，而是结合中国企业实际讲解如何落地。WBS分解和风险管理两个模块对我帮助最大。', date: '2026-02-18' },
  { id: 51, trainer_id: 16, course_id: 19, author: '曹总监', company: '某中型制造企业', role: '运营总监', rating: 5, content: '我们公司正在筹建PMO，韩老师的课帮我们理清了PMO定位和建设路径。特别是"从成本中心到利润中心"的思路，让老板也认可了PMO的价值。', date: '2026-01-25' },

  // 宋雨桐 (id: 17)
  { id: 52, trainer_id: 17, course_id: 20, author: '秦HRD', company: '某快速成长互联网公司', role: 'HRD', rating: 5, content: '宋老师的文化诊断工作坊让我们第一次用数据看清了公司的文化现状。OCAI评估结果出来后，管理层终于达成了文化变革的共识。', date: '2026-02-22' },
  { id: 53, trainer_id: 17, course_id: 21, author: '卢经理', company: '某连锁品牌企业', role: '培训经理', rating: 4, content: '新员工文化融入营效果超出预期。以前新员工3个月还找不到归属感，现在1个月就能融入团队。试用期留存率提升了20%。', date: '2026-02-08' },

  // 郑凯文 (id: 18)
  { id: 54, trainer_id: 18, course_id: 22, author: '范法务总监', company: '某跨境电商公司', role: '法务总监', rating: 5, content: '郑老师既懂法律又懂业务，讲数据合规不是照搬法条，而是结合真实执法案例讲解企业如何避坑。DPIA实操环节特别实用。', date: '2026-02-25' },
  { id: 55, trainer_id: 18, course_id: 23, author: '苗经理', company: '某医疗器械公司', role: '合规经理', rating: 5, content: '反腐败培训以前总被业务部门吐槽"走过场"，郑老师用大量真实案例和场景模拟让培训变得有用。销售团队反馈"终于知道什么能做什么不能做了"。', date: '2026-02-12' },
]

// 根据培训师 ID 获取评价
export function getReviewsByTrainerId(trainerId: number): Review[] {
  return reviews.filter(r => r.trainer_id === trainerId)
}

// 根据课程 ID 获取评价
export function getReviewsByCourseId(courseId: number): Review[] {
  return reviews.filter(r => r.course_id === courseId)
}
