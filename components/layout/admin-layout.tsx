"use client"

import { AdminHeader } from "./header/admin-header"
import { AdminFooter } from "./footer/admin-footer"
import { AdminSidebar } from "./sidebar/admin-sidebar"
import { useAuth } from "@/hooks/use-auth"
import { LoadingState } from "./main/loading-state"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

interface AdminLayoutProps {
  children: React.ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/auth/login")
      } else if (user.userType !== "admin") {
        router.push("/dashboard")
      }
    }
  }, [loading, user, router])

  if (loading) {
    return <LoadingState />
  }

  if (!user || user.userType !== "admin") {
    return null
  }

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-64 border-r md:block">
        <AdminSidebar />
      </aside>
      <div className="flex flex-1 flex-col">
        <AdminHeader />
        <main className="flex-1 p-8">
          {children}
        </main>
        <AdminFooter />
      </div>
    </div>
  )
}