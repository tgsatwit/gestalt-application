"use client"

// Previous imports remain...

interface SessionCalendarProps {
  sessions: Session[]
  onUpdateSession: (id: string, data: Partial<Session>) => Promise<void>
  onCancelSession: (id: string) => Promise<void>
  onDeleteSession: (id: string) => Promise<void>
  onMessageAttendees: (sessionId: string, message: string) => Promise<void>
}

export function SessionCalendar({ 
  sessions,
  onUpdateSession,
  onCancelSession,
  onDeleteSession,
  onMessageAttendees,
}: SessionCalendarProps) {
  // Previous state and functions remain...

  return (
    <div className="flex gap-8">
      {/* Calendar component remains... */}
      <Card className="flex-1">
        <CardContent className="p-6">
          <h3 className="font-semibold mb-4">
            {selectedDate.toLocaleDateString('en-US', { 
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </h3>
          <ScrollArea className="h-[400px] pr-4">
            {selectedDateSessions.length === 0 ? (
              <p className="text-muted-foreground text-sm">No sessions scheduled for this date</p>
            ) : (
              <div className="space-y-4">
                {selectedDateSessions.map((session) => (
                  <div
                    key={session.id}
                    className="p-4 rounded-lg border bg-card text-card-foreground"
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
                      <div className="flex items-center gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => setEditingSession(session)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit Session</DialogTitle>
                              <DialogDescription>
                                Make changes to this session
                              </DialogDescription>
                            </DialogHeader>
                            <SessionForm
                              children={children}
                              initialData={session}
                              onSubmit={async (data) => {
                                await onUpdateSession(session.id, data)
                                setEditingSession(null)
                              }}
                              onClose={() => setEditingSession(null)}
                              onDelete={onDeleteSession}
                              onMessage={onMessageAttendees}
                            />
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                    {(session.notes || session.privateNotes) && (
                      <div className="mt-4 space-y-2">
                        {session.notes && (
                          <div>
                            <h5 className="text-sm font-medium">Session Notes</h5>
                            <p className="text-sm text-muted-foreground">{session.notes}</p>
                          </div>
                        )}
                        {session.privateNotes && (
                          <div>
                            <h5 className="text-sm font-medium flex items-center gap-2">
                              Private Notes
                              <Badge variant="outline" className="text-yellow-500">Only visible to you</Badge>
                            </h5>
                            <p className="text-sm text-muted-foreground">{session.privateNotes}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}