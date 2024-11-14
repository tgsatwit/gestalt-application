import { UserNav } from "@/components/dashboard/user-nav"
import { NotificationDropdown } from "@/components/notifications/notification-dropdown"
import { Brain } from "lucide-react"
import Link from "next/link"

export function AdminHeader() {
  return (
    <header className="border-b">
      <div className="flex h-16 items-center px-4">
        <Link className="flex items-center" href="/admin/dashboard">
          <Brain className="h-6 w-6" />
          <span className="ml-2 text-xl font-bold">Admin</span>
        </Link>
        <div className="ml-auto flex items-center space-x-4">
          <NotificationDropdown />
          <UserNav />
        </div>
      </div>
    </header>
  )
}