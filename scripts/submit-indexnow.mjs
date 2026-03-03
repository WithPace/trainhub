#!/usr/bin/env node
/**
 * submit-indexnow.mjs — 部署后自动向 IndexNow 提交 URL
 * 支持 Bing、Yandex、Seznam、Naver 等所有 IndexNow 兼容引擎
 *
 * 用法: node scripts/submit-indexnow.mjs
 */

const SITE_URL = 'https://withpace.github.io'
const KEY = '8a831d8d3a0448a3a7a9c66023a176c6'
const KEY_LOCATION = `${SITE_URL}/trainhub/${KEY}.txt`

// 所有可索引的 URL（与 sitemap.xml 保持一致）
const urls = [
  '/trainhub/',
  '/trainhub/trainers',
  '/trainhub/courses',
  '/trainhub/blog',
  '/trainhub/join',
  '/trainhub/faq',
  '/trainhub/match',
  '/trainhub/about',
  '/trainhub/assessment',
  '/trainhub/tools/budget-calculator',
  '/trainhub/tools/roi-calculator',
  // 分类专题 (6)
  '/trainhub/topics/leadership',
  '/trainhub/topics/sales',
  '/trainhub/topics/digital',
  '/trainhub/topics/hr',
  '/trainhub/topics/finance',
  '/trainhub/topics/communication',
  // 培训师详情 (15)
  ...Array.from({ length: 15 }, (_, i) => `/trainhub/trainers/${i + 1}`),
  // 课程详情 (17)
  ...Array.from({ length: 17 }, (_, i) => `/trainhub/courses/${i + 1}`),
  // 博客文章 (53)
  '/trainhub/blog/enterprise-training-industry-disruption',
  '/trainhub/blog/how-to-choose-ai-training-course',
  '/trainhub/blog/leadership-training-trends-2026',
  '/trainhub/blog/how-to-evaluate-trainer-quality',
  '/trainhub/blog/training-roi-measurement',
  '/trainhub/blog/freelance-trainer-pricing-guide',
  '/trainhub/blog/new-manager-first-90-days',
  '/trainhub/blog/enterprise-training-budget-planning-2026',
  '/trainhub/blog/training-needs-analysis-methods',
  '/trainhub/blog/digital-training-trends-2026',
  '/trainhub/blog/annual-training-plan-design',
  '/trainhub/blog/online-vs-offline-training',
  '/trainhub/blog/training-effectiveness-evaluation',
  '/trainhub/blog/how-to-choose-training-provider',
  '/trainhub/blog/new-employee-onboarding-training-guide',
  '/trainhub/blog/how-to-build-internal-training-system',
  '/trainhub/blog/middle-management-training-courses',
  '/trainhub/blog/team-building-training-program',
  '/trainhub/blog/sales-team-training-program',
  '/trainhub/blog/how-to-choose-training-platform',
  '/trainhub/blog/manufacturing-training-program-design',
  '/trainhub/blog/corporate-learning-map-guide',
  '/trainhub/blog/why-training-fails-solutions',
  '/trainhub/blog/finance-industry-training-program',
  '/trainhub/blog/healthcare-training-compliance-guide',
  '/trainhub/blog/annual-training-summary-report-template',
  '/trainhub/blog/retail-industry-training-program',
  '/trainhub/blog/training-needs-survey-template',
  '/trainhub/blog/it-industry-tech-training-program',
  '/trainhub/blog/education-industry-training-program',
  '/trainhub/blog/trainer-evaluation-form-template',
  '/trainhub/blog/logistics-industry-training-program',
  '/trainhub/blog/energy-industry-training-program',
  '/trainhub/blog/training-effectiveness-tracking-template',
  '/trainhub/blog/catering-industry-training-program',
  '/trainhub/blog/construction-industry-training-program',
  '/trainhub/blog/training-project-proposal-template',
  '/trainhub/blog/internal-trainer-development-system',
  '/trainhub/blog/china-training-market-trends-2026',
  '/trainhub/blog/training-contract-agreement-template',
  '/trainhub/blog/high-potential-talent-development-program',
  '/trainhub/blog/top-training-course-directions-2026',
  '/trainhub/blog/trainer-personal-brand-building-guide',
  '/trainhub/blog/training-supplier-management-strategy',
  '/trainhub/blog/hotel-industry-training-program',
  '/trainhub/blog/enterprise-digital-transformation-training-guide',
  '/trainhub/blog/trainer-invitation-letter-template',
  '/trainhub/blog/automotive-industry-training-program',
  '/trainhub/blog/training-budget-application-template',
  '/trainhub/blog/training-full-process-management-guide',
  '/trainhub/blog/real-estate-industry-training-program',
  '/trainhub/blog/training-course-development-guide',
  '/trainhub/blog/cross-department-collaboration-training',
].map(path => `${SITE_URL}${path}`)

// IndexNow 支持的搜索引擎 API 端点
const ENGINES = [
  'https://api.indexnow.org/indexnow',  // 通用端点（分发给所有参与者）
]

async function submitBatch(engine, batch) {
  const body = {
    host: 'withpace.github.io',
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList: batch,
  }

  try {
    const res = await fetch(engine, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(body),
    })

    // IndexNow 返回 200 或 202 都表示成功
    if (res.ok || res.status === 202) {
      console.log(`  OK  ${engine} — ${batch.length} URLs submitted (${res.status})`)
      return true
    } else {
      const text = await res.text().catch(() => '')
      console.log(`  WARN ${engine} — ${res.status} ${text.slice(0, 100)}`)
      return false
    }
  } catch (err) {
    console.log(`  FAIL ${engine} — ${err.message}`)
    return false
  }
}

async function main() {
  console.log(`\n  IndexNow Submission — ${urls.length} URLs\n`)

  // IndexNow 单次最多提交 10000 个 URL，我们远不到上限
  for (const engine of ENGINES) {
    await submitBatch(engine, urls)
  }

  // 同时 ping Google sitemap（Google 不支持 IndexNow 但支持 sitemap ping）
  try {
    const sitemapUrl = `${SITE_URL}/trainhub/sitemap.xml`
    const googlePing = `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`
    const res = await fetch(googlePing)
    console.log(`  ${res.ok ? 'OK' : 'WARN'}  Google sitemap ping (${res.status})`)
  } catch (err) {
    console.log(`  FAIL Google sitemap ping — ${err.message}`)
  }

  console.log('\n  Done.\n')
}

main().catch(console.error)
