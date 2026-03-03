import { Star, Quote, Building2 } from 'lucide-react'

const testimonials = [
  {
    content: '张老师的领导力课程非常实战，不是空洞的理论。两天下来，我们管理团队的沟通效率明显提升。',
    author: '王总监',
    role: '运营总监',
    company: '某上市科技公司',
    rating: 5,
  },
  {
    content: '李老师的顾问式销售课程彻底改变了我们团队的销售方式。从推产品变成了帮客户解决问题，季度业绩提升了30%。',
    author: '陈总',
    role: '销售VP',
    company: '某医疗器械公司',
    rating: 5,
  },
  {
    content: '全员AI培训效果超预期，连50多岁的老员工都学会了用AI写方案。林老师的耐心和教学方法值得点赞。',
    author: '吴总',
    role: '行政副总',
    company: '某地产公司',
    rating: 5,
  },
  {
    content: '孙老师的战略工作坊帮我们找到了第二增长曲线。半年内服务收入占比从5%提升到20%。',
    author: '丁CEO',
    role: 'CEO',
    company: '某智能硬件公司',
    rating: 5,
  },
  {
    content: '杨老师的新媒体课太实战了，一个月后抖音粉丝从0涨到5万，带来了实实在在的销售转化。',
    author: '任总监',
    role: '市场总监',
    company: '某美妆品牌',
    rating: 5,
  },
  {
    content: '敏捷项目管理课程非常实战，Sprint规划和回顾会议的模板直接拿来就能用。团队交付速度提升了40%。',
    author: '崔PM',
    role: '产品总监',
    company: '某电商平台',
    rating: 5,
  },
]

const trustStats = [
  { value: '49+', label: '真实学员评价' },
  { value: '4.8', label: '平均评分 (满分5)' },
  { value: '95%', label: '学员满意度' },
  { value: '2000+', label: '累计服务企业' },
]

const industries = ['互联网/科技', '金融', '制造业', '医疗', '零售', '教育', '地产', '餐饮']

export default function TestimonialsSection() {
  return (
    <section className="bg-gray-50 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">来自学员的真实反馈</h2>
          <p className="mt-2 text-gray-500">每一条评价都来自真实培训场景</p>
        </div>

        {/* 评价卡片 */}
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map(testimonial => (
            <div
              key={testimonial.author}
              className="relative rounded-xl border border-gray-200 bg-white p-6 transition-shadow hover:shadow-md"
            >
              <Quote className="absolute right-4 top-4 h-8 w-8 text-blue-100" />
              <div className="flex gap-0.5">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="mt-3 text-sm leading-relaxed text-gray-600">
                "{testimonial.content}"
              </p>
              <div className="mt-4 flex items-center gap-3 border-t border-gray-100 pt-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600">
                  {testimonial.author.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{testimonial.author}</p>
                  <p className="text-xs text-gray-500">
                    {testimonial.role} · {testimonial.company}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 信任数据条 */}
        <div className="mt-12 grid grid-cols-2 gap-4 rounded-xl bg-blue-600 p-6 text-white sm:grid-cols-4 sm:p-8">
          {trustStats.map(stat => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl font-bold sm:text-3xl">{stat.value}</div>
              <div className="mt-1 text-xs text-blue-200 sm:text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* 合作企业行业标签 */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <span className="text-sm text-gray-400">覆盖行业：</span>
          {industries.map(industry => (
            <span
              key={industry}
              className="inline-flex items-center gap-1 rounded-full border border-gray-200 px-3 py-1 text-xs text-gray-500"
            >
              <Building2 className="h-3 w-3" />
              {industry}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
