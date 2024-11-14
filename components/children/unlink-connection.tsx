"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
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
import { toast } from "sonner"
import { doc, updateDoc, arrayRemove, collection, writeBatch, Timestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Unlink } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

interface UnlinkConnectionProps {
  childId: string
  childName: string
  connectionId: string
  connectionName: string
  type: 'specialist' | 'parent'
}

export function UnlinkConnection({ 
  childId, 
  childName,
  connectionId, 
  connectionName,
  type 
}: UnlinkConnectionProps) {
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  const handleUnlink = async () => {
    if (!user) return

    setLoading(true)
    try {
      const batch = writeBatch(db)
      const childRef = doc(db, 'children', childId)
      const timestamp = Timestamp.fromDate(new Date())

      // Remove from appropriate arrays based on type
      const updateData: any = {
        updatedAt: timestamp
      }

      if (type === 'specialist') {
        updateData.specialistIds = arrayRemove(connectionId)
        updateData.pendingSpecialists = arrayRemove({
          uid: connectionId,
          name: connectionName,
          status: 'accepted'
        })
      } else {
        updateData.parentIds = arrayRemove(connectionId)
        updateData.pendingParents = arrayRemove({
          uid: connectionId,
          name: connectionName,
          status: 'accepted'
        })
      }

      batch.update(childRef, updateData)

      // Add to connection history
      batch.set(doc(collection(db, 'connectionHistory')), {
        type,
        action: 'unlinked',
        childId,
        childName,
        parentId: user.id,
        parentName: user.name,
        connectedUserId: connectionId,
        connectedUserName: connectionName,
        createdAt: timestamp
      })

      await batch.commit()
      toast.success(`${type} unlinked successfully`)
    } catch (error) {
      console.error('Error unlinking connection:', error)
      toast.error('Failed to unlink connection')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Unlink className="h-4 w-4 mr-2" />
          Unlink
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Unlink {type}</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to unlink {connectionName} from {childName}'s profile? They will no longer have access to this profile.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleUnlink}
            disabled={loading}
          >
            {loading ? "Unlinking..." : "Unlink"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}