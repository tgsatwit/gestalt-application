"use client"

// Previous imports remain...
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Trash2, Send } from "lucide-react"

interface SessionFormProps {
  children: Child[]
  initialData?: Partial<Session>
  onSubmit: (data: any) => Promise<void>
  onClose?: () => void
  onDelete?: (id: string) => Promise<void>
  onMessage?: (sessionId: string, message: string) => Promise<void>
}

export function SessionForm({ 
  children,
  initialData,
  onSubmit,
  onClose,
  onDelete,
  onMessage,
}: SessionFormProps) {
  // Previous state and form setup remains...
  const [showMessageInput, setShowMessageInput] = useState(false)
  const [message, setMessage] = useState("")
  const [sendingMessage, setSendingMessage] = useState(false)

  const handleSendMessage = async () => {
    if (!message.trim() || !initialData?.id) return
    
    setSendingMessage(true)
    try {
      await onMessage?.(initialData.id, message)
      setMessage("")
      setShowMessageInput(false)
      toast.success("Message sent to attendees")
    } catch (error) {
      console.error("Error sending message:", error)
      toast.error("Failed to send message")
    } finally {
      setSendingMessage(false)
    }
  }

  return (
    <ScrollArea className="max-h-[80vh]">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 p-1">
          {/* Previous form fields remain... */}

          <div className="flex justify-between gap-4">
            <div className="flex gap-2">
              {initialData?.id && onDelete && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button type="button" variant="destructive">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Session
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Session</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this session? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => {
                          onDelete(initialData.id!)
                          onClose?.()
                        }}
                        className="bg-destructive text-destructive-foreground"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}

              {initialData?.id && onMessage && (
                <div className="flex-1">
                  {!showMessageInput ? (
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => setShowMessageInput(true)}
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Message Attendees
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Input
                        placeholder="Type your message..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                      />
                      <Button
                        type="button"
                        onClick={handleSendMessage}
                        disabled={sendingMessage || !message.trim()}
                      >
                        {sendingMessage ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Send className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => {
                          setShowMessageInput(false)
                          setMessage("")
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex gap-2">
              {onClose && (
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
              )}
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {initialData ? "Update" : "Schedule"} Session
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </ScrollArea>
  )
}