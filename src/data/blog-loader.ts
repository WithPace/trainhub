// 博客文章按需加载器
// 使用 Vite 的 import.meta.glob 实现每篇文章独立 chunk，按需加载
// 替代旧的 blog.ts 单文件（540KB → 每篇 8-21KB）

import type { BlogPost } from '@/data/blog-meta'

// Vite 在构建时扫描 ./blog/*.ts，为每个文件生成独立 chunk
// eager: false 确保懒加载（仅在调用 loader() 时才下载对应 chunk）
const articleModules = import.meta.glob<{ default: BlogPost }>('./blog/*.ts', {
  eager: false,
})

/**
 * 按 slug 加载单篇文章完整内容（含正文）
 * 每次调用仅下载对应文章的 chunk（~8-21KB），而非全部 44 篇
 */
export async function loadBlogPost(slug: string): Promise<BlogPost | undefined> {
  const key = `./blog/${slug}.ts`
  const loader = articleModules[key]
  if (!loader) return undefined
  const mod = await loader()
  return mod.default
}
