"use client"

import { Child } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { format } from "date-fns"
import { Check, X } from "lucide-react"

interface PendingRequestsListProps {
  requests: Child[]
  onAccept: (childId: string) => Promise<void>
  onDecline: (childId: string) => Promise<void>
}

export function PendingRequestsList({ 
  requests,
  onAccept,
  onDecline,
}: PendingRequestsListProps) {
  if (requests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[200px] text-center">
        <p className="text-2xl font-semibold">No pending requests</p>
        <p className="text-muted-foreground">
          New client requests will appear here
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {requests.map((request) => (
        <Card key={request.id}>
          <CardHeader>
            <CardTitle>{request.name}</CardTitle>
            <CardDescription>
              Born {format(new Date(request.dateOfBirth), "PPP")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {request.notes && (
              <p className="text-sm text-muted-foreground">{request.notes}</p>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDecline(request.id)}
            >
              <X className="h-4 w-4 mr-2" />
              Decline
            </Button>
            <Button
              size="sm"
              onClick={() => onAccept(request.id)}
            >
              <Check className="h-4 w-4 mr-2" />
              Accept
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}