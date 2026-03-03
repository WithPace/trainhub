import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getTopicBySlug } from '@/data/topics'
import { categories, courses, trainers } from '@/data/mock'
import PageHead from '@/components/seo/PageHead'
import TopicHero from '@/components/topic/TopicHero'
import TopicIntroduction from '@/components/topic/TopicIntroduction'
import TopicPainPoints from '@/components/topic/TopicPainPoints'
import TopicBenefits from '@/components/topic/TopicBenefits'
import TopicCourses from '@/components/topic/TopicCourses'
import TopicTrainers from '@/components/topic/TopicTrainers'
import TopicFaq from '@/components/topic/TopicFaq'
import TopicRelatedPosts from '@/components/topic/TopicRelatedPosts'
import TopicCTA from '@/components/topic/TopicCTA'
import TopicRelatedKeywords from '@/components/topic/TopicRelatedKeywords'
import type { TopicData } from '@/data/topics'
import type { BlogPostMeta } from '@/data/blog-meta'

// 构建 JSON-LD 结构化数据
function buildJsonLd(topic: TopicData, categoryName: string, baseUrl: string) {
  const categoryCourses = courses.filter(c => c.category_id === topic.categoryId)

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: '首页', item: baseUrl },
      { '@type': 'ListItem', position: 2, name: '培训领域', item: `${baseUrl}courses` },
      { '@type': 'ListItem', position: 3, name: categoryName, item: `${baseUrl}topics/${topic.slug}` },
    ],
  }

  const faqPage = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: topic.faq.map(item => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  }

  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${categoryName}培训课程`,
    numberOfItems: categoryCourses.length,
    itemListElement: categoryCourses.map((course, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: course.title,
      url: `${baseUrl}courses/${course.id}`,
    })),
  }

  return [breadcrumb, faqPage, itemList]
}

export default function TopicPage() {
  const { slug } = useParams<{ slug: string }>()
  const topic = slug ? getTopicBySlug(slug) : undefined
  const category = topic ? categories.find(c => c.id === topic.categoryId) : undefined

  // 筛选该分类下的课程和培训师
  const categoryCourses = topic ? courses.filter(c => c.category_id === topic.categoryId) : []
  const categoryTrainers = category
    ? trainers.filter(t =>
        t.specialties.some(s =>
          s.includes(category.name) ||
          category.description.split('、').some(keyword => s.includes(keyword))
        )
      )
    : []

  // 异步加载相关博客文章（保持 blog-meta 独立 chunk）
  const [relatedPosts, setRelatedPosts] = useState<BlogPostMeta[]>([])
  useEffect(() => {
    if (!topic || !category) return
    import('@/data/blog-meta').then(({ getRelatedBlogPostsByKeywords }) => {
      const keywords = [category.name, ...topic.relatedKeywords.slice(0, 3)]
      setRelatedPosts(getRelatedBlogPostsByKeywords(keywords, 4))
    })
  }, [topic, category])

  const baseUrl = 'https://withpace.github.io/trainhub/'

  // 404 处理
  if (!topic || !category) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center px-4">
        <h1 className="text-2xl font-bold text-gray-900">未找到该培训领域</h1>
        <p className="mt-2 text-gray-500">请返回首页查看所有培训领域</p>
        <Link to="/" className="mt-6 rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700">
          返回首页
        </Link>
      </div>
    )
  }

  const jsonLdData = buildJsonLd(topic, category.name, baseUrl)

  return (
    <div>
      <PageHead
        title={topic.title}
        description={topic.metaDescription}
        path={`/topics/${topic.slug}`}
      />
      {jsonLdData.map((data, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
      ))}

      <TopicHero topic={topic} categoryName={category.name} categoryIcon={category.icon} />
      <TopicIntroduction categoryName={category.name} introduction={topic.introduction} />
      <TopicPainPoints painPoints={topic.painPoints} />
      <TopicBenefits benefits={topic.benefits} />
      <TopicCourses categoryName={category.name} topicSlug={topic.slug} courses={categoryCourses} />
      <TopicTrainers categoryName={category.name} trainers={categoryTrainers} />
      <TopicFaq categoryName={category.name} faq={topic.faq} />
      <TopicRelatedPosts categoryName={category.name} posts={relatedPosts} />
      <TopicCTA categoryName={category.name} />
      <TopicRelatedKeywords keywords={topic.relatedKeywords} />
    </div>
  )
}
