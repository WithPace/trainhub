import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { JsonLd } from '@/components/seo/JsonLd'
import PageHead from '@/components/seo/PageHead'

interface FAQItem {
  question: string
  answer: string
}

const faqs: FAQItem[] = [
  {
    question: 'TrainHub 是什么平台？',
    answer:
      'TrainHub 是一个专注于企业培训领域的师资匹配平台。我们汇聚了经过严格筛选的专业培训师，覆盖领导力、销售技巧、数字化转型、人力资源、财务管理、沟通表达等核心领域，帮助企业快速找到最适合的培训解决方案。',
  },
  {
    question: '如何在 TrainHub 找到合适的培训师？',
    answer:
      '您可以通过以下方式筛选培训师：1）按培训领域浏览分类页面；2）使用搜索功能按关键词查找；3）按城市、专长、从业经验等条件筛选；4）查看培训师详情页了解背景、课程大纲和学员评价。如果不确定，也可以直接提交咨询，我们会为您推荐。',
  },
  {
    question: 'TrainHub 如何收费？',
    answer:
      '对企业客户：浏览培训师信息和提交咨询完全免费。培训费用由培训师直接报价，TrainHub 不加收中间费用，价格完全透明。对培训师：目前入驻和展示均为免费，我们致力于打造一个公平开放的师资平台。',
  },
  {
    question: '培训师的资质如何保障？',
    answer:
      '每位入驻 TrainHub 的培训师都经过三重筛选：1）资质审核——验证从业背景、专业认证和行业经验；2）授课评估——审核课程大纲质量和教学方法论；3）口碑验证——收集并展示真实学员反馈和企业评价。平台培训师平均从业经验超过14年。',
  },
  {
    question: '可以定制企业内训方案吗？',
    answer:
      '当然可以。大多数培训师都支持根据企业的行业特点、团队现状和培训目标定制专属课程。您可以在培训师详情页查看标准课程大纲，然后通过咨询表单说明您的定制需求，培训师会提供针对性方案和报价。',
  },
  {
    question: '培训形式有哪些？',
    answer:
      '目前平台上的培训以线下面授为主，包括：企业内训（培训师到企业现场授课）、公开课（多家企业学员共同参与）、工作坊（小组互动式学习）。部分培训师也支持线上直播授课，具体请在咨询时确认。',
  },
  {
    question: '如何成为 TrainHub 的入驻培训师？',
    answer:
      '我们欢迎在企业培训领域有丰富经验的专业培训师入驻。入驻流程：1）在"培训师入驻"页面提交申请；2）我们的团队会在3个工作日内审核您的资质；3）审核通过后，您可以创建个人主页、上传课程信息和学员评价。入驻完全免费。',
  },
  {
    question: '提交咨询后多久能收到回复？',
    answer:
      '我们承诺在1个工作日内与您取得联系。通常情况下，您提交咨询后2-4小时内即可收到初步回复，包括推荐的培训师人选和初步方案建议。',
  },
  {
    question: '培训效果如何评估？',
    answer:
      '我们建议企业从四个层面评估培训效果（柯氏四级评估模型）：1）反应层——学员满意度调查；2）学习层——知识/技能测试；3）行为层——培训后3个月行为变化观察；4）结果层——业务指标改善。部分培训师会提供专业的培训效果评估服务。',
  },
  {
    question: '企业培训的预算一般是多少？',
    answer:
      '企业培训费用因培训师级别、课程时长、参训人数和定制程度而异。平台上的课程价格区间通常在1.5万-8万元/天。我们建议企业根据培训目标和预算，在课程页面按价格筛选合适的方案，也可以直接咨询获取精确报价。',
  },
]

// 构建 FAQPage JSON-LD
function buildFAQSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

function FAQAccordionItem({ item, isOpen, onToggle }: { item: FAQItem; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="border-b border-gray-200">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between py-5 text-left"
      >
        <span className="text-base font-medium text-gray-900 pr-4">{item.question}</span>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 shrink-0 text-gray-500" />
        ) : (
          <ChevronDown className="h-5 w-5 shrink-0 text-gray-500" />
        )}
      </button>
      {isOpen && (
        <div className="pb-5 text-sm leading-relaxed text-gray-600">
          {item.answer}
        </div>
      )}
    </div>
  )
}

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <div>
      <PageHead
        title="常见问题 | TrainHub - 企业培训平台"
        description="关于 TrainHub 平台、培训服务、培训师入驻和合作方式的常见疑问解答。"
        path="/faq"
      />
      <JsonLd data={buildFAQSchema()} />

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-3xl font-bold sm:text-4xl">常见问题</h1>
          <p className="mt-3 text-lg text-blue-100">
            关于 TrainHub 平台、培训服务和合作方式的常见疑问解答
          </p>
        </div>
      </section>

      {/* FAQ 列表 */}
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="divide-y-0">
            {faqs.map((faq, index) => (
              <FAQAccordionItem
                key={index}
                item={faq}
                isOpen={openIndex === index}
                onToggle={() => setOpenIndex(openIndex === index ? null : index)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-xl font-bold text-gray-900">没有找到您的问题？</h2>
          <p className="mt-2 text-gray-500">
            欢迎直接联系我们，我们会在1个工作日内回复
          </p>
          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              to="/about"
              className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
            >
              联系我们
            </Link>
            <Link
              to="/join"
              className="rounded-lg border border-gray-300 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              培训师入驻
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
