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
]

// 根据培训师 ID 获取评价
export function getReviewsByTrainerId(trainerId: number): Review[] {
  return reviews.filter(r => r.trainer_id === trainerId)
}

// 根据课程 ID 获取评价
export function getReviewsByCourseId(courseId: number): Review[] {
  return reviews.filter(r => r.course_id === courseId)
}
