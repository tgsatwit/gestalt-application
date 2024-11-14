"use client"

import { Child } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { format } from "date-fns"

interface ClientListProps {
  clients: Child[]
}

export function ClientList({ clients }: ClientListProps) {
  if (clients.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[200px] text-center">
        <p className="text-2xl font-semibold">No active clients</p>
        <p className="text-muted-foreground">
          Your active client relationships will appear here
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {clients.map((client) => (
        <Card key={client.id}>
          <CardHeader>
            <CardTitle>{client.name}</CardTitle>
            <CardDescription>
              Born {format(new Date(client.dateOfBirth), "PPP")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {client.notes && (
              <p className="text-sm text-muted-foreground">{client.notes}</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}