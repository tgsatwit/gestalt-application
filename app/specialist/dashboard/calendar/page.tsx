"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { format, isSameDay } from "date-fns"
import { useSessions } from "@/hooks/use-sessions"
import { Loader2, Plus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { SessionForm } from "@/components/sessions/session-form"
import { useClients } from "@/hooks/use-clients"

export default function SpecialistCalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const { sessions, loading: sessionsLoading, addSession, updateSession, cancelSession } = useSessions()
  const { clients, loading: clientsLoading } = useClients()
  const [dialogOpen, setDialogOpen] = useState(false)

  if (sessionsLoading || clientsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  const sessionDates = sessions.reduce((acc, session) => {
    const dateStr = session.date.toISOString().split('T')[0]
    if (!acc[dateStr]) {
      acc[dateStr] = []
    }
    acc[dateStr].push(session)
    return acc
  }, {} as Record<string, any[]>)

  const selectedDateSessions = sessions.filter(session => 
    isSameDay(session.date, selectedDate)
  ).sort((a, b) => a.date.getTime() - b.date.getTime())

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-green-500/10 text-green-500 hover:bg-green-500/20'
      case 'cancelled':
        return 'bg-red-500/10 text-red-500 hover:bg-red-500/20'
      default:
        return 'bg-gray-500/10 text-gray-500 hover:bg-gray-500/20'
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Calendar</h2>
          <p className="text-muted-foreground">
            Manage your therapy sessions
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Schedule Session
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Schedule New Session</DialogTitle>
              <DialogDescription>
                Create a new therapy session
              </DialogDescription>
            </DialogHeader>
            <SessionForm
              clients={clients}
              onSubmit={async (data) => {
                await addSession(data)
                setDialogOpen(false)
              }}
              onClose={() => setDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-8">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(date) => date && setSelectedDate(date)}
          className="rounded-md border"
          modifiers={{
            session: (date) => {
              const dateStr = date.toISOString().split('T')[0]
              return !!sessionDates[dateStr]
            },
          }}
          modifiersStyles={{
            session: {
              fontWeight: 'bold',
              backgroundColor: 'hsl(var(--primary) / 0.1)',
              color: 'hsl(var(--primary))',
            },
          }}
        />
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>
              {selectedDate.toLocaleDateString('en-US', { 
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </CardTitle>
            <CardDescription>
              Scheduled sessions for this date
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] pr-4">
              {selectedDateSessions.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  No sessions scheduled for this date
                </p>
              ) : (
                <div className="space-y-4">
                  {selectedDateSessions.map((session) => (
                    <div
                      key={session.id}
                      className="p-4 rounded-lg border"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h4 className="font-medium">
                            {format(new Date(`${format(session.date, 'yyyy-MM-dd')}T${session.startTime}`), 'h:mm a')} - 
                            {format(new Date(`${format(session.date, 'yyyy-MM-dd')}T${session.endTime}`), 'h:mm a')}
                          </h4>
                          <Badge className={getStatusColor(session.status)}>
                            {session.status}
                          </Badge>
                        </div>
                        {session.status === 'scheduled' && (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => cancelSession(session.id)}
                          >
                            Cancel
                          </Button>
                        )}
                      </div>
                      {session.notes && (
                        <p className="text-sm text-muted-foreground mt-2">
                          {session.notes}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}