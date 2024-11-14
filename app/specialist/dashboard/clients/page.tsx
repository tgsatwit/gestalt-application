"use client"

import { useClients } from "@/hooks/use-clients"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { Loader2, UserMinus } from "lucide-react"
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

export default function ClientsPage() {
  const { clients, pendingRequests, loading, handleRequest, unlinkFromChild } = useClients()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Clients</h2>
        <p className="text-muted-foreground">
          Manage your client connections and requests
        </p>
      </div>

      {pendingRequests.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Pending Requests</h3>
          <div className="grid gap-4">
            {pendingRequests.map((request) => (
              <Card key={request.id} className="w-full">
                <CardHeader>
                  <CardTitle>{request.childName}</CardTitle>
                  <CardDescription>
                    Requested by {request.senderName} on{" "}
                    {format(request.createdAt, "PPP")}
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
      )}

      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Active Clients</h3>
        <div className="grid gap-4">
          {clients.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">
                  No active clients at this time
                </p>
              </CardContent>
            </Card>
          ) : (
            clients.map((client) => (
              <Card key={client.id} className="w-full">
                <CardHeader className="flex flex-row items-start justify-between">
                  <div>
                    <CardTitle>{client.name}</CardTitle>
                    <CardDescription>
                      Born {format(new Date(client.dateOfBirth), "PPP")}
                    </CardDescription>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <UserMinus className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Unlink from Client</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to unlink from this client? You will no longer have access to their profile.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => unlinkFromChild(client.id)}
                          className="bg-destructive text-destructive-foreground"
                        >
                          Unlink
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardHeader>
                <CardContent>
                  {client.notes && (
                    <p className="text-sm text-muted-foreground">{client.notes}</p>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}