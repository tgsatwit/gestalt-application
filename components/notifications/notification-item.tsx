"use client"

import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Notification } from "@/hooks/use-notifications"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"
import { format } from "date-fns"

interface NotificationItemProps {
  notification: Notification
  onMarkAsRead: (id: string) => Promise<void>
  onDelete: (id: string) => Promise<void>
}

export function NotificationItem({
  notification,
  onMarkAsRead,
  onDelete,
}: NotificationItemProps) {
  const router = useRouter()

  const handleClick = async () => {
    if (!notification.read) {
      await onMarkAsRead(notification.id)
    }
    if (notification.actionUrl) {
      router.push(notification.actionUrl)
    }
  }

  return (
    <div
      className={cn(
        "p-4 rounded-lg border relative",
        !notification.read && "bg-muted/50"
      )}
    >
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2"
        onClick={() => onDelete(notification.id)}
      >
        <X className="h-4 w-4" />
      </Button>
      <div className="pr-8" onClick={handleClick}>
        <h5 className="font-medium mb-1">{notification.title}</h5>
        <p className="text-sm text-muted-foreground mb-2">
          {notification.message}
        </p>
        <p className="text-xs text-muted-foreground">
          {format(notification.createdAt, 'PPp')}
        </p>
      </div>
    </div>
  )
}