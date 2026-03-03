import { useState } from 'react'
import { getCategories, getTrainers, getCourses } from '@/services/api'
import { useQuery } from '@/hooks/useQuery'
import type { BlogPostMeta } from '@/data/blog-meta'
import HeroSection from '@/components/home/HeroSection'
import StatsBar from '@/components/home/StatsBar'
import CategoriesSection from '@/components/home/CategoriesSection'
import FeaturedTrainersSection from '@/components/home/FeaturedTrainersSection'
import FeaturedCoursesSection from '@/components/home/FeaturedCoursesSection'
import LatestPostsSection from '@/components/home/LatestPostsSection'
import ToolkitPromoSection from '@/components/home/ToolkitPromoSection'
import WhyTrainHubSection from '@/components/home/WhyTrainHubSection'
import HowItWorksSection from '@/components/home/HowItWorksSection'
import TestimonialsSection from '@/components/home/TestimonialsSection'
import AssessmentCTA from '@/components/home/AssessmentCTA'
import MatchCTA from '@/components/home/MatchCTA'
import TrainerJoinCTA from '@/components/home/TrainerJoinCTA'

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
      <HeroSection searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <StatsBar />
      <CategoriesSection categories={categories} />
      <FeaturedTrainersSection trainers={featuredTrainers} />
      <FeaturedCoursesSection courses={featuredCourses} />
      <LatestPostsSection posts={latestPosts} />
      <ToolkitPromoSection />
      <WhyTrainHubSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <AssessmentCTA />
      <MatchCTA />
      <TrainerJoinCTA />
    </div>
  )
}
