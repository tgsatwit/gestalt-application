"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Child } from "@/lib/types"
import { db } from "@/lib/firebase"
import { collection, query, where, getDocs, Timestamp, addDoc, updateDoc, arrayUnion } from "firebase/firestore"
import { toast } from "sonner"
import { useAuth } from "@/hooks/use-auth"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Search, UserPlus } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface AddSpecialistDialogProps {
  child: Child
  onAddSpecialist: (childId: string, specialistData: { 
    email?: string;
    name: string;
    status?: 'pending' | 'accepted';
  }) => Promise<void>
}

export function AddSpecialistDialog({ child, onAddSpecialist }: AddSpecialistDialogProps) {
  const [open, setOpen] = useState(false)
  const [type, setType] = useState<'reference' | 'invite'>('invite')
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)
  const [searching, setSearching] = useState(false)
  const [foundSpecialist, setFoundSpecialist] = useState<any>(null)
  const { user } = useAuth()

  const searchSpecialist = async () => {
    if (!email) return

    setSearching(true)
    try {
      const usersRef = collection(db, "users")
      const q = query(
        usersRef, 
        where("email", "==", email.toLowerCase()),
        where("userType", "==", "specialist")
      )
      const querySnapshot = await getDocs(q)
      
      if (!querySnapshot.empty) {
        const specialistData = {
          id: querySnapshot.docs[0].id,
          ...querySnapshot.docs[0].data()
        }
        setFoundSpecialist(specialistData)
        setName(specialistData.name)
      } else {
        setFoundSpecialist(null)
        setName("")
      }
    } catch (error) {
      console.error("Error searching for specialist:", error)
      toast.error("Failed to search for specialist")
    } finally {
      setSearching(false)
    }
  }

  const handleSubmit = async () => {
    if (!user) return
    setLoading(true)

    try {
      const timestamp = Timestamp.fromDate(new Date())

      if (type === 'reference') {
        if (!name) {
          toast.error("Please enter a specialist name")
          return
        }

        // Add vanity specialist directly to child's profile
        await onAddSpecialist(child.id, {
          name,
          status: 'accepted'
        })

        toast.success("Reference specialist added successfully")
        setOpen(false)
      } else {
        if (!email) {
          toast.error("Please enter a specialist email")
          return
        }

        // Create connection request
        const requestRef = await addDoc(collection(db, 'connectionRequests'), {
          type: 'specialist',
          childId: child.id,
          childName: child.name,
          senderId: user.id,
          senderName: user.name,
          recipientEmail: email.toLowerCase(),
          recipientName: foundSpecialist?.name || email,
          recipientId: foundSpecialist?.id,
          status: 'pending',
          createdAt: timestamp,
          updatedAt: timestamp
        })

        // Update child's profile with pending specialist
        await updateDoc(doc(db, 'children', child.id), {
          pendingSpecialists: arrayUnion({
            email: email.toLowerCase(),
            name: foundSpecialist?.name || email,
            status: 'pending',
            requestId: requestRef.id,
            invitedAt: timestamp
          }),
          updatedAt: timestamp
        })

        // Create notification if specialist exists
        if (foundSpecialist) {
          await addDoc(collection(db, 'notifications'), {
            userId: foundSpecialist.id,
            type: 'connection_request',
            title: 'New Connection Request',
            message: `${user.name} has invited you to connect with ${child.name}`,
            read: false,
            createdAt: timestamp,
            metadata: {
              requestId: requestRef.id,
              childId: child.id,
              senderId: user.id
            }
          })
        }

        toast.success(foundSpecialist 
          ? "Invitation sent to specialist's dashboard"
          : "Invitation email will be sent to specialist"
        )

        setOpen(false)
      }

      // Reset form
      setEmail("")
      setName("")
      setFoundSpecialist(null)
      setType('invite')
    } catch (error) {
      console.error("Error adding specialist:", error)
      toast.error("Failed to add specialist")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <UserPlus className="h-4 w-4 mr-2" />
          Add Specialist
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Specialist</DialogTitle>
          <DialogDescription>
            Add a specialist to {child.name}'s profile
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <RadioGroup
            defaultValue="invite"
            value={type}
            onValueChange={(value) => {
              setType(value as 'reference' | 'invite')
              setFoundSpecialist(null)
              setEmail("")
              setName("")
            }}
            className="grid grid-cols-2 gap-4"
          >
            <div>
              <RadioGroupItem
                value="reference"
                id="reference"
                className="peer sr-only"
              />
              <Label
                htmlFor="reference"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <span>Reference Only</span>
              </Label>
            </div>
            <div>
              <RadioGroupItem
                value="invite"
                id="invite"
                className="peer sr-only"
              />
              <Label
                htmlFor="invite"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <span>Send Invitation</span>
              </Label>
            </div>
          </RadioGroup>

          {type === 'reference' ? (
            <div className="space-y-2">
              <Label htmlFor="name">Specialist Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter specialist name"
              />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Specialist Email</Label>
                <div className="flex gap-2">
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="specialist@example.com"
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={searchSpecialist}
                    disabled={searching || !email}
                  >
                    {searching ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Search className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {email && !searching && (
                <Alert>
                  <AlertDescription>
                    {foundSpecialist ? (
                      <>Found specialist account for <strong>{foundSpecialist.name}</strong>. 
                      They will receive an invitation in their dashboard.</>
                    ) : (
                      <>No specialist account found. An email invitation will be sent to join the platform.</>
                    )}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

          <Button 
            onClick={handleSubmit}
            className="w-full"
            disabled={loading || (!name && type === 'reference') || (!email && type === 'invite')}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {type === 'reference' ? 'Adding...' : 'Sending...'}
              </>
            ) : (
              type === 'reference' ? 'Add Reference' : 'Send Invitation'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}