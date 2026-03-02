import { Link } from 'react-router-dom'
import { Target, Shield, Handshake, Lightbulb } from 'lucide-react'

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 px-4 py-20 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-3xl font-bold sm:text-4xl">关于 TrainHub</h1>
          <p className="mt-4 text-lg text-blue-100">
            连接企业与优质培训师的专业平台，让企业培训更简单、更高效
          </p>
        </div>
      </section>

      {/* 平台介绍 */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-bold text-gray-900">我们是谁</h2>
          <div className="mt-6 space-y-4 leading-relaxed text-gray-600">
            <p>
              TrainHub 是一个专注于企业培训领域的专业服务平台。我们致力于连接企业与顶尖培训师，
              帮助企业快速找到最适合的培训解决方案。
            </p>
            <p>
              平台汇聚了来自各行各业的资深培训师，涵盖领导力、销售技巧、数字化转型、人力资源、
              财务管理、沟通表达等核心领域。每一位培训师都经过严格的筛选和认证，确保培训质量。
            </p>
            <p>
              我们相信，优秀的培训能够激发团队潜力，推动企业发展。无论您是大型企业还是成长型公司，
              TrainHub 都能为您提供专业、高效的培训服务。
            </p>
          </div>
        </div>
      </section>

      {/* 核心价值 */}
      <section className="bg-gray-50 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-2xl font-bold text-gray-900">为什么选择我们</h2>
          <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2">
            {[
              {
                icon: Shield,
                title: '品质保障',
                description: '所有培训师均经过严格背景审核和教学能力评估，确保教学质量。',
              },
              {
                icon: Target,
                title: '精准匹配',
                description: '根据企业需求、行业特点和预算，精准推荐最合适的培训师和课程。',
              },
              {
                icon: Handshake,
                title: '全程服务',
                description: '从需求沟通、方案定制到培训执行、效果评估，提供一站式服务。',
              },
              {
                icon: Lightbulb,
                title: '持续创新',
                description: '紧跟行业趋势，持续引入前沿课程内容，助力企业保持竞争优势。',
              },
            ].map(item => (
              <div key={item.title} className="rounded-xl bg-white p-8 shadow-sm">
                <item.icon className="h-10 w-10 text-blue-600" />
                <h3 className="mt-4 text-lg font-semibold text-gray-900">{item.title}</h3>
                <p className="mt-2 text-sm text-gray-500">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 联系我们 */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold text-gray-900">联系我们</h2>
          <p className="mt-4 text-gray-500">
            如有任何问题或合作意向，欢迎随时联系我们
          </p>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="rounded-xl border border-gray-200 p-6">
              <p className="text-sm text-gray-500">商务合作</p>
              <p className="mt-1 text-lg font-semibold text-gray-900">hi@trainhub.cn</p>
            </div>
            <div className="rounded-xl border border-gray-200 p-6">
              <p className="text-sm text-gray-500">培训师入驻</p>
              <Link to="/join" className="mt-1 block text-lg font-semibold text-emerald-600 hover:text-emerald-700">
                在线申请入驻 &rarr;
              </Link>
            </div>
          </div>
          <p className="mt-6 text-sm text-gray-400">
            我们会在1个工作日内回复您的消息
          </p>
        </div>
      </section>
    </div>
  )
}
