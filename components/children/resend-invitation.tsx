"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { doc, updateDoc, Timestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { RefreshCw } from "lucide-react"

interface ResendInvitationProps {
  childId: string
  recipientEmail: string
  type: 'specialist' | 'parent'
}

export function ResendInvitation({ childId, recipientEmail, type }: ResendInvitationProps) {
  const [loading, setLoading] = useState(false)

  const handleResend = async () => {
    setLoading(true)
    try {
      const requestRef = doc(db, 'connectionRequests', childId)
      await updateDoc(requestRef, {
        createdAt: Timestamp.fromDate(new Date()),
        status: 'pending'
      })
      toast.success(`Invitation resent to ${type}`)
    } catch (error) {
      console.error('Error resending invitation:', error)
      toast.error('Failed to resend invitation')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleResend}
      disabled={loading}
    >
      <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
      Resend
    </Button>
  )
}