interface TopicIntroductionProps {
  categoryName: string
  introduction: string
}

export default function TopicIntroduction({ categoryName, introduction }: TopicIntroductionProps) {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-2xl font-bold text-gray-900">关于{categoryName}培训</h2>
        <p className="mt-6 text-base leading-relaxed text-gray-600">
          {introduction}
        </p>
      </div>
    </section>
  )
}
