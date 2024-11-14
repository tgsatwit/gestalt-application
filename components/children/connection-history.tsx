"use client"

import { useConnectionHistory } from "@/hooks/use-connection-history"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { format } from "date-fns"

export function ConnectionHistory() {
  const { history, loading } = useConnectionHistory()

  if (loading || history.length === 0) {
    return null
  }

  const getActionText = (action: string) => {
    switch (action) {
      case 'invited':
        return 'invited'
      case 'accepted':
        return 'accepted invitation'
      case 'rejected':
        return 'declined invitation'
      case 'removed':
        return 'removed'
      case 'unlinked':
        return 'unlinked from'
      default:
        return action
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Connection History</CardTitle>
        <CardDescription>
          Recent changes to child profile connections
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-4">
            {history.map((record) => (
              <div
                key={record.id}
                className="flex flex-col space-y-1 pb-4 border-b last:border-0"
              >
                <p className="text-sm">
                  <span className="font-medium">{record.connectedUserName}</span>
                  {' '}{getActionText(record.action)}{' '}
                  <span className="font-medium">{record.childName}</span>
                </p>
                <p className="text-xs text-muted-foreground">
                  {format(record.createdAt, 'PPp')}
                </p>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}