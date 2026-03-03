import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle, Users, BookOpen, Award, Shield, Zap, TrendingUp, ClipboardCheck, Calendar, Clock, Star, Quote, Building2, MessageSquareText, Brain, Handshake } from 'lucide-react'
import { getCategories, getTrainers, getCourses } from '@/services/api'
import { useQuery } from '@/hooks/useQuery'
import TrainerCard from '@/components/ui/TrainerCard'
import CourseCard from '@/components/ui/CourseCard'
import SearchBar from '@/components/ui/SearchBar'
import type { BlogPostMeta } from '@/data/blog-meta'

/** 异步加载最新博客文章（保持 blog-meta 独立 chunk，不污染主 bundle） */
async function fetchLatestBlogPosts(): Promise<BlogPostMeta[]> {
  const { getLatestBlogPosts } = await import('@/data/blog-meta')
  return getLatestBlogPosts(3)
}

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const { data: categories } = useQuery(() => getCategories(), [])
  const { data: featuredTrainers } = useQuery(() => getTrainers({ featured: true }), [])
  const { data: featuredCourses } = useQuery(() => getCourses({ featured: true }), [])
  const { data: latestPosts } = useQuery(fetchLatestBlogPosts, [])

  return (
    <div>
      {/* Hero 区域 */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 px-4 py-20 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-3xl font-bold sm:text-4xl lg:text-5xl">
            企业培训采购，告别中间商加价
          </h1>
          <p className="mt-4 text-lg text-blue-100 sm:text-xl">
            直接对接实战派培训师，课程大纲·价格区间·学员评价全透明。3分钟智能匹配，从需求到落地一站搞定
          </p>
          <div className="mx-auto mt-8 max-w-xl">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="搜索培训师、课程或专业领域..."
              className="[&_input]:border-white/20 [&_input]:bg-white/10 [&_input]:text-white [&_input]:placeholder-blue-200"
            />
          </div>
          {searchQuery && (
            <div className="mt-4">
              <Link
                to={`/courses?q=${encodeURIComponent(searchQuery)}`}
                className="inline-flex items-center gap-1 text-sm text-blue-200 hover:text-white"
              >
                查看搜索结果 <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* 价值亮点 */}
      <section className="border-b border-gray-200 bg-white px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 md:grid-cols-4">
          {[
            { icon: Users, label: '严选培训师', value: '15位实战派' },
            { icon: BookOpen, label: '覆盖领域', value: '6大方向' },
            { icon: Award, label: '中间成本', value: '省50%+' },
            { icon: CheckCircle, label: '需求诊断', value: '免费' },
          ].map(stat => (
            <div key={stat.label} className="text-center">
              <stat.icon className="mx-auto h-8 w-8 text-blue-600" />
              <div className="mt-2 text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 分类导航 */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">培训领域</h2>
            <p className="mt-2 text-gray-500">覆盖企业培训核心领域</p>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {(categories ?? []).map(cat => (
              <Link
                key={cat.id}
                to={`/topics/${cat.slug}`}
                className="group rounded-xl border border-gray-200 p-4 text-center transition-all hover:border-blue-300 hover:shadow-md sm:p-6"
              >
                <span className="text-4xl">{cat.icon}</span>
                <h3 className="mt-3 font-semibold text-gray-900 group-hover:text-blue-600">
                  {cat.name}
                </h3>
                <p className="mt-1 line-clamp-2 text-xs text-gray-500">{cat.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 精选培训师 */}
      <section className="bg-gray-50 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">精选培训师</h2>
              <p className="mt-1 text-gray-500">经过严格筛选的行业专家</p>
            </div>
            <Link
              to="/trainers"
              className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              查看全部 <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {(featuredTrainers ?? []).map(trainer => (
              <TrainerCard key={trainer.id} trainer={trainer} />
            ))}
          </div>
        </div>
      </section>

      {/* 精选课程 */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">热门课程</h2>
              <p className="mt-1 text-gray-500">最受企业欢迎的培训课程</p>
            </div>
            <Link
              to="/courses"
              className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              查看全部 <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {(featuredCourses ?? []).map(course => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      </section>

      {/* 最新文章 */}
      <section className="bg-gray-50 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">最新文章</h2>
              <p className="mt-1 text-gray-500">行业洞察与培训管理实操干货</p>
            </div>
            <Link
              to="/blog"
              className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              查看全部 <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
            {(latestPosts ?? []).map(post => (
              <Link
                key={post.id}
                to={`/blog/${post.id}`}
                className="group rounded-xl border border-gray-200 bg-white p-5 transition-shadow hover:shadow-md"
              >
                <span className="inline-block rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                  {post.category}
                </span>
                <h3 className="mt-3 line-clamp-2 text-base font-semibold text-gray-900 group-hover:text-blue-600">
                  {post.title}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-gray-500">
                  {post.excerpt}
                </p>
                <div className="mt-4 flex items-center gap-3 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {post.publishDate}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {post.readTime}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 为什么选择 TrainHub */}
      <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">为什么选择 TrainHub</h2>
            <p className="mt-2 text-gray-500">企业培训采购的更优解</p>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">严选师资，质量保障</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                每位培训师经过资质审核、授课评估和学员反馈三重筛选。平均从业经验14年，累计服务企业超过2000家。拒绝"PPT朗读者"，只推荐真正能落地的实战派。
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-green-100">
                <Zap className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">去中间商，透明定价</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                传统培训采购经过3-4层中间商，价格虚高50%-200%。TrainHub让企业直接对接培训师，课程大纲、价格区间、学员评价全部公开透明，不花冤枉钱。
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">数据驱动，精准匹配</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                基于行业、规模、培训目标智能推荐最合适的培训师和课程。覆盖领导力、销售、数字化转型等6大核心领域，从需求到落地一站式解决。
              </p>
            </div>
          </div>
          <div className="mt-10 rounded-xl bg-gray-50 p-6 text-center">
            <p className="text-sm leading-relaxed text-gray-600">
              中国企业培训市场规模超过<span className="font-semibold text-gray-900">6000亿元</span>，但企业找到合适培训师的平均周期长达<span className="font-semibold text-gray-900">3-4周</span>。
              TrainHub 致力于缩短这个周期到<span className="font-semibold text-blue-600">3天</span>，让每一笔培训预算都花在刀刃上。
            </p>
          </div>
        </div>
      </section>

      {/* 使用流程 — 3步搞定 */}
      <section className="bg-gradient-to-b from-white to-gray-50 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">3 步找到最合适的培训师</h2>
            <p className="mt-2 text-gray-500">从需求到落地，最快 3 天搞定</p>
          </div>
          <div className="relative mt-12 grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-0">
            {/* 连接线（仅桌面端） */}
            <div className="pointer-events-none absolute inset-x-0 top-12 hidden h-0.5 bg-gradient-to-r from-blue-200 via-blue-400 to-blue-200 md:block" style={{ left: '16.7%', right: '16.7%' }} />

            {[
              {
                step: '01',
                icon: MessageSquareText,
                title: '描述需求',
                desc: '5 个问题快速定位培训方向、预算范围和人数规模',
                cta: { label: '开始匹配', to: '/match' },
                color: 'blue',
              },
              {
                step: '02',
                icon: Brain,
                title: '智能匹配',
                desc: '基于行业、规模、目标，AI 推荐最匹配的培训师和课程',
                cta: { label: '试试需求诊断', to: '/assessment' },
                color: 'indigo',
              },
              {
                step: '03',
                icon: Handshake,
                title: '直接对接',
                desc: '零中间商，直接与培训师沟通方案和报价，价格透明',
                cta: { label: '浏览培训师', to: '/trainers' },
                color: 'emerald',
              },
            ].map((item) => {
              const colorMap: Record<string, { bg: string; ring: string; text: string; ctaBg: string; ctaHover: string }> = {
                blue:    { bg: 'bg-blue-50',    ring: 'ring-blue-600',    text: 'text-blue-600',    ctaBg: 'bg-blue-600',    ctaHover: 'hover:bg-blue-700' },
                indigo:  { bg: 'bg-indigo-50',  ring: 'ring-indigo-600',  text: 'text-indigo-600',  ctaBg: 'bg-indigo-600',  ctaHover: 'hover:bg-indigo-700' },
                emerald: { bg: 'bg-emerald-50', ring: 'ring-emerald-600', text: 'text-emerald-600', ctaBg: 'bg-emerald-600', ctaHover: 'hover:bg-emerald-700' },
              }
              const c = colorMap[item.color]
              return (
                <div key={item.step} className="relative flex flex-col items-center text-center">
                  {/* 步骤圆圈 */}
                  <div className={`relative z-10 flex h-24 w-24 flex-col items-center justify-center rounded-full ${c.bg} ring-4 ${c.ring} ring-offset-2`}>
                    <item.icon className={`h-8 w-8 ${c.text}`} />
                    <span className={`mt-1 text-xs font-bold ${c.text}`}>STEP {item.step}</span>
                  </div>
                  <h3 className="mt-6 text-lg font-bold text-gray-900">{item.title}</h3>
                  <p className="mt-2 max-w-xs text-sm leading-relaxed text-gray-500">{item.desc}</p>
                  <Link
                    to={item.cta.to}
                    className={`mt-4 inline-flex items-center gap-1 rounded-lg ${c.ctaBg} px-4 py-2 text-sm font-medium text-white transition-colors ${c.ctaHover}`}
                  >
                    {item.cta.label} <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* 社会证明 — 真实学员评价 */}
      <section className="bg-gray-50 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">来自学员的真实反馈</h2>
            <p className="mt-2 text-gray-500">每一条评价都来自真实培训场景</p>
          </div>

          {/* 评价卡片 */}
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
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
            ].map(testimonial => (
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
            {[
              { value: '49+', label: '真实学员评价' },
              { value: '4.8', label: '平均评分 (满分5)' },
              { value: '95%', label: '学员满意度' },
              { value: '2000+', label: '累计服务企业' },
            ].map(stat => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-bold sm:text-3xl">{stat.value}</div>
                <div className="mt-1 text-xs text-blue-200 sm:text-sm">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* 合作企业行业标签 */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <span className="text-sm text-gray-400">覆盖行业：</span>
            {['互联网/科技', '金融', '制造业', '医疗', '零售', '教育', '地产', '餐饮'].map(industry => (
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

      {/* 需求诊断入口 */}
      <section className="bg-gradient-to-br from-indigo-50 to-blue-50 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100">
            <ClipboardCheck className="h-7 w-7 text-indigo-600" />
          </div>
          <h2 className="mt-5 text-2xl font-bold text-gray-900 sm:text-3xl">
            不确定从哪里开始？3分钟诊断培训需求
          </h2>
          <p className="mt-3 text-gray-500">
            回答 10 个问题，快速了解企业在领导力、专业技能、团队协作、数字化能力四个维度的培训现状，获取专属诊断报告
          </p>
          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              to="/assessment"
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-8 py-3 font-medium text-white transition-colors hover:bg-indigo-700"
            >
              开始需求诊断 <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/match"
              className="inline-block rounded-lg border border-gray-300 bg-white px-8 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              直接智能匹配
            </Link>
          </div>
        </div>
      </section>

      {/* CTA — 智能匹配 */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 px-4 py-16 text-center text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-2xl font-bold sm:text-3xl">不知道选哪个？试试智能匹配</h2>
          <p className="mt-3 text-blue-100">
            回答 5 个简单问题，AI 为您推荐最适合的培训师和课程
          </p>
          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              to="/match"
              className="inline-block rounded-lg bg-white px-8 py-3 font-medium text-blue-600 transition-colors hover:bg-blue-50"
            >
              开始智能匹配
            </Link>
            <Link
              to="/about"
              className="inline-block rounded-lg border border-white/30 px-8 py-3 font-medium text-white transition-colors hover:bg-white/10"
            >
              免费咨询
            </Link>
          </div>
        </div>
      </section>

      {/* CTA — 培训师入驻 */}
      <section className="bg-emerald-600 px-4 py-16 text-center text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-2xl font-bold sm:text-3xl">您是培训师？加入我们</h2>
          <p className="mt-3 text-emerald-100">
            展示您的专业能力，直接对接优质企业客户，零佣金入驻
          </p>
          <Link
            to="/join"
            className="mt-6 inline-block rounded-lg bg-white px-8 py-3 font-medium text-emerald-600 transition-colors hover:bg-emerald-50"
          >
            申请入驻
          </Link>
        </div>
      </section>
    </div>
  )
}
