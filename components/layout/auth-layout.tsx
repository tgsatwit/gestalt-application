"use client"

import { AuthHeader } from "./header/auth-header"
import { AuthFooter } from "./footer/auth-footer"
import { ParentSidebar } from "./sidebar/parent-sidebar"
import { useAuth } from "@/hooks/use-auth"
import { LoadingState } from "./main/loading-state"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

interface AuthLayoutProps {
  children: React.ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login")
    }
  }, [loading, user, router])

  if (loading) {
    return <LoadingState />
  }

  if (!user) {
    return null
  }

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-64 border-r md:block">
        <ParentSidebar />
      </aside>
      <div className="flex flex-1 flex-col">
        <AuthHeader />
        <main className="flex-1 p-8">
          {children}
        </main>
        <AuthFooter />
      </div>
    </div>
  )
}