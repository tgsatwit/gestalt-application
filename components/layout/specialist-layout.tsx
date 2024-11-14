"use client"

import { AuthHeader } from "./header/auth-header"
import { AuthFooter } from "./footer/auth-footer"
import { SpecialistSidebar } from "./sidebar/specialist-sidebar"
import { useAuth } from "@/hooks/use-auth"
import { LoadingState } from "./main/loading-state"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

interface SpecialistLayoutProps {
  children: React.ReactNode
}

export function SpecialistLayout({ children }: SpecialistLayoutProps) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/auth/login")
      } else if (user.userType !== "specialist") {
        router.push("/dashboard")
      }
    }
  }, [loading, user, router])

  if (loading) {
    return <LoadingState />
  }

  if (!user || user.userType !== "specialist") {
    return null
  }

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-64 border-r md:block">
        <SpecialistSidebar />
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