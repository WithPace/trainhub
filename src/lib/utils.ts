import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// 头像背景色列表 — 基于培训师 ID 确定性选择
const AVATAR_COLORS = [
  '3b82f6', // blue
  '8b5cf6', // violet
  'ec4899', // pink
  'f97316', // orange
  '10b981', // emerald
  '6366f1', // indigo
  '14b8a6', // teal
  'f59e0b', // amber
  'ef4444', // red
  '06b6d4', // cyan
]

/** 生成培训师头像 URL（DiceBear initials style，无需认证） */
export function getAvatarUrl(name: string, id: number): string {
  const bg = AVATAR_COLORS[id % AVATAR_COLORS.length]
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${bg}&color=fff&size=128&font-size=0.4&bold=true`
}
