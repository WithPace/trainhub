/**
 * 博客文章自动内链
 * 扫描文本中的关键词，首次出现时自动转为站内链接
 * 原则：每个关键词在单篇文章中最多链接 1 次，避免过度优化
 */

interface LinkRule {
  keyword: string
  url: string
}

// 关键词 → 站内 URL 映射（按长度降序，优先匹配长关键词）
const LINK_RULES: LinkRule[] = [
  // Topic 着陆页
  { keyword: '领导力培训', url: '/topics/leadership' },
  { keyword: '销售培训', url: '/topics/sales' },
  { keyword: '数字化转型培训', url: '/topics/digital' },
  { keyword: '人力资源培训', url: '/topics/hr' },
  { keyword: '财务管理培训', url: '/topics/finance' },
  { keyword: '沟通表达培训', url: '/topics/communication' },
  { keyword: '项目管理培训', url: '/topics/project-management' },
  { keyword: '企业文化培训', url: '/topics/culture' },
  { keyword: '合规培训', url: '/topics/compliance' },
  // 核心功能页
  { keyword: '培训需求诊断', url: '/assessment' },
  { keyword: '培训需求自评', url: '/assessment' },
  { keyword: '需求诊断', url: '/assessment' },
  { keyword: '智能匹配', url: '/match' },
  // 列表页
  { keyword: '培训师列表', url: '/trainers' },
  { keyword: '课程列表', url: '/courses' },
  { keyword: '浏览培训师', url: '/trainers' },
  { keyword: '浏览课程', url: '/courses' },
  // 领域关键词 → Topic 页面
  { keyword: '领导力', url: '/topics/leadership' },
  { keyword: '销售技巧', url: '/topics/sales' },
  { keyword: '数字化转型', url: '/topics/digital' },
  { keyword: '人力资源', url: '/topics/hr' },
  { keyword: '财务管理', url: '/topics/finance' },
  { keyword: '沟通表达', url: '/topics/communication' },
  { keyword: '项目管理', url: '/topics/project-management' },
  { keyword: '企业文化', url: '/topics/culture' },
  { keyword: '合规风控', url: '/topics/compliance' },
  { keyword: 'PMP认证', url: '/topics/project-management' },
  { keyword: 'PMO', url: '/topics/project-management' },
  { keyword: '文化变革', url: '/topics/culture' },
  { keyword: '数据合规', url: '/topics/compliance' },
  { keyword: '反腐败', url: '/topics/compliance' },
].sort((a, b) => b.keyword.length - a.keyword.length) // 长关键词优先匹配

/**
 * 为纯文本片段注入内链标记
 * 返回包含 markdown 链接标记的文本，供 renderTextWithLinks 进一步解析
 * @param text 原始纯文本（不含 markdown 链接）
 * @param linked 已经链接过的关键词集合（跨段落去重）
 */
export function injectInternalLinks(text: string, linked: Set<string>): string {
  let result = text
  for (const rule of LINK_RULES) {
    if (linked.has(rule.url)) continue // 同一 URL 只链接一次
    const idx = result.indexOf(rule.keyword)
    if (idx === -1) continue
    // 确保不在已有链接标记内（简单检查前后字符）
    const before = idx > 0 ? result[idx - 1] : ''
    const after = idx + rule.keyword.length < result.length ? result[idx + rule.keyword.length] : ''
    if (before === '[' || before === '(' || after === ']' || after === ')') continue
    // 替换为 markdown 链接格式
    result = result.slice(0, idx) + `[${rule.keyword}](${rule.url})` + result.slice(idx + rule.keyword.length)
    linked.add(rule.url)
  }
  return result
}
