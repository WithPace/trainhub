import { useState } from 'react'
import { ChevronDown, HelpCircle } from 'lucide-react'

interface FaqItemData {
  question: string
  answer: string
}

function FaqItem({ question, answer }: FaqItemData) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border-b border-gray-200">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-5 text-left"
      >
        <span className="pr-4 text-base font-medium text-gray-900">{question}</span>
        <ChevronDown
          className={`h-5 w-5 shrink-0 text-gray-500 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <div className="pb-5 text-sm leading-relaxed text-gray-600">
          {answer}
        </div>
      )}
    </div>
  )
}

interface TopicFaqProps {
  categoryName: string
  faq: FaqItemData[]
}

export default function TopicFaq({ categoryName, faq }: TopicFaqProps) {
  return (
    <section className="bg-gray-50 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-50">
            <HelpCircle className="h-6 w-6 text-blue-600" />
          </div>
          <h2 className="mt-4 text-2xl font-bold text-gray-900">常见问题</h2>
          <p className="mt-2 text-gray-500">关于{categoryName}培训的疑问解答</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white px-6">
          {faq.map((item, index) => (
            <FaqItem key={index} question={item.question} answer={item.answer} />
          ))}
        </div>
      </div>
    </section>
  )
}
