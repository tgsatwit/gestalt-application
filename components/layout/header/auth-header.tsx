import { UserNav } from "@/components/dashboard/user-nav"
import { NotificationDropdown } from "@/components/notifications/notification-dropdown"

export function AuthHeader() {
  return (
    <header className="border-b">
      <div className="flex h-16 items-center px-4">
        <div className="ml-auto flex items-center space-x-4">
          <NotificationDropdown />
          <UserNav />
        </div>
      </div>
    </header>
  )
}