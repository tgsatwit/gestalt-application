"use client"

import { Session } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"

interface SessionListProps {
  sessions: Session[]
  onCancel: (id: string) => Promise<void>
  onUpdate: (id: string, data: Partial<Session>) => Promise<void>
}

export function SessionList({ sessions, onCancel, onUpdate }: SessionListProps) {
  if (sessions.length === 0) {
    return (
      <p className="text-muted-foreground text-center">No sessions scheduled for this date</p>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "text-blue-500"
      case "completed":
        return "text-green-500"
      case "cancelled":
        return "text-red-500"
      default:
        return "text-gray-500"
    }
  }

  return (
    <div className="space-y-4">
      {sessions.map((session) => (
        <div
          key={session.id}
          className="flex items-center justify-between p-4 rounded-lg border"
        >
          <div>
            <p className="font-medium">
              {format(new Date(`${format(session.date, 'yyyy-MM-dd')}T${session.startTime}`), 'h:mm a')} - 
              {format(new Date(`${format(session.date, 'yyyy-MM-dd')}T${session.endTime}`), 'h:mm a')}
            </p>
            <p className={`text-sm ${getStatusColor(session.status)}`}>
              {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
            </p>
            {session.notes && (
              <p className="text-sm text-muted-foreground mt-1">{session.notes}</p>
            )}
          </div>
          {session.status === 'scheduled' && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  Cancel
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Cancel Session</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to cancel this session? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>No, keep session</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => onCancel(session.id)}
                    className="bg-destructive text-destructive-foreground"
                  >
                    Yes, cancel session
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      ))}
    </div>
  )
}