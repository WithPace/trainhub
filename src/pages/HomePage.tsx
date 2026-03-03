import { useState } from 'react'
import { getCategories } from '@/services/api'
import { useQuery } from '@/hooks/useQuery'
import type { BlogPostMeta } from '@/data/blog-meta'
import HeroSection from '@/components/home/HeroSection'
import CategoriesSection from '@/components/home/CategoriesSection'
import LatestPostsSection from '@/components/home/LatestPostsSection'
import ToolkitPromoSection from '@/components/home/ToolkitPromoSection'
import WhyTrainHubSection from '@/components/home/WhyTrainHubSection'
import HowItWorksSection from '@/components/home/HowItWorksSection'
import AssessmentCTA from '@/components/home/AssessmentCTA'

/** 异步加载最新博客文章（保持 blog-meta 独立 chunk，不污染主 bundle） */
async function fetchLatestBlogPosts(): Promise<BlogPostMeta[]> {
  const { getLatestBlogPosts } = await import('@/data/blog-meta')
  return getLatestBlogPosts(3)
}

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const { data: categories } = useQuery(() => getCategories(), [])
  const { data: latestPosts } = useQuery(fetchLatestBlogPosts, [])

  return (
    <div>
      <HeroSection searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <ToolkitPromoSection />
      <CategoriesSection categories={categories} />
      <WhyTrainHubSection />
      <LatestPostsSection posts={latestPosts} />
      <HowItWorksSection />
      <AssessmentCTA />
    </div>
  )
}
