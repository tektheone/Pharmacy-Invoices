import React from 'react'
import { Header } from '@/components/organisms/Header'

interface LayoutProps {
 children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
 return (
  <div className="min-h-screen gradient-bg">
   <Header />
   <main className="container py-6 animate-fade-in">
    {children}
   </main>
  </div>
 )
}
