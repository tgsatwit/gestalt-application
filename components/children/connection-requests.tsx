"use client"

import { useConnectionRequests } from "@/hooks/use-connection-requests"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { Loader2 } from "lucide-react"

export function ConnectionRequests() {
  const { requests, loading, handleRequest } = useConnectionRequests()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-24">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    )
  }

  if (requests.length === 0) {
    return null
  }

  return (
    <div className="space-y-4 mb-8">
      <h3 className="text-lg font-medium">Pending Connection Requests</h3>
      <div className="grid gap-4">
        {requests.map((request) => (
          <Card key={request.id}>
            <CardHeader>
              <CardTitle>Connection Request for {request.childName}</CardTitle>
              <CardDescription>
                From {request.senderName} • {format(request.createdAt, 'PPp')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => handleRequest(request.id, "rejected")}
                >
                  Decline
                </Button>
                <Button
                  onClick={() => handleRequest(request.id, "accepted")}
                >
                  Accept
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}