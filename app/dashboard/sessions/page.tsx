"use client"

// Previous imports remain...

export default function SessionsPage() {
  const { 
    sessions, 
    loading: sessionsLoading, 
    addSession, 
    updateSession, 
    cancelSession, 
    deleteSession,
    sendMessageToAttendees 
  } = useSessions()
  const { children, loading: childrenLoading } = useChildren()
  const [open, setOpen] = useState(false)

  if (sessionsLoading || childrenLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Sessions</h2>
          <p className="text-muted-foreground">
            Schedule and manage therapy sessions
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
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
              children={children}
              onSubmit={async (data) => {
                await addSession(data)
                setOpen(false)
              }}
              onClose={() => setOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <SessionCalendar 
        sessions={sessions}
        onUpdateSession={updateSession}
        onCancelSession={cancelSession}
        onDeleteSession={deleteSession}
        onMessageAttendees={sendMessageToAttendees}
      />
    </div>
  )
}