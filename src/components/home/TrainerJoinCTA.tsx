import { Link } from 'react-router-dom'

export default function TrainerJoinCTA() {
  return (
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
  )
}
