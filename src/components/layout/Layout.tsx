import type { ReactNode } from 'react'
import Header from './Header'
import Footer from './Footer'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      {/* pb-16 lg:pb-0 为移动端底部固定 CTA 栏留出空间 */}
      <main className="flex-1 pb-16 lg:pb-0">{children}</main>
      <Footer />
    </div>
  )
}
