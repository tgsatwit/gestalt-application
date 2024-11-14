"use client"

import { Button } from "@/components/ui/button"
import { ResendInvitation } from "./resend-invitation"
import { UserMinus } from "lucide-react"
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

interface PendingConnectionActionsProps {
  childId: string
  recipientEmail: string
  type: 'specialist' | 'parent'
  onRemove: () => Promise<void>
}

export function PendingConnectionActions({
  childId,
  recipientEmail,
  type,
  onRemove
}: PendingConnectionActionsProps) {
  return (
    <div className="flex items-center space-x-2">
      <ResendInvitation
        childId={childId}
        recipientEmail={recipientEmail}
        type={type}
      />
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="ghost" size="sm">
            <UserMinus className="h-4 w-4 mr-2" />
            Remove
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Pending Invitation</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this pending invitation? The {type} will no longer be able to accept it.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onRemove}>
              Remove Invitation
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}