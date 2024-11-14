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
import { UserPlus } from "lucide-react"
import { Child } from "@/lib/types"
import { db } from "@/lib/firebase"
import { collection, query, where, getDocs } from "firebase/firestore"
import { toast } from "sonner"

interface AddCaregiverDialogProps {
  child: Child
  onAddCaregiver: (childId: string, caregiverData: { 
    email?: string; 
    name: string;
    status?: 'pending' | 'accepted';
  }) => Promise<void>
}

export function AddCaregiverDialog({ child, onAddCaregiver }: AddCaregiverDialogProps) {
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)
  const [isVanityProfile, setIsVanityProfile] = useState(false)

  const handleSubmit = async () => {
    if (!name) {
      toast.error("Please enter a name for the caregiver");
      return;
    }

    try {
      if (!isVanityProfile && email) {
        // Check if caregiver exists
        const usersRef = collection(db, "users");
        const q = query(
          usersRef, 
          where("email", "==", email.toLowerCase()),
          where("userType", "==", "parent")
        );
        const querySnapshot = await getDocs(q);
        
        await onAddCaregiver(child.id, {
          email: email.toLowerCase(),
          name,
          status: 'pending'
        });
      } else {
        // Add as vanity profile
        await onAddCaregiver(child.id, {
          name,
          status: 'accepted'
        });
      }
      
      setOpen(false)
      setEmail("")
      setName("")
      setIsVanityProfile(false)
    } catch (error) {
      console.error("Error adding caregiver:", error)
      toast.error("Failed to add caregiver")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <UserPlus className="h-4 w-4 mr-2" />
          Add Caregiver
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Caregiver</DialogTitle>
          <DialogDescription>
            Add a caregiver to {child.name}'s profile
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Caregiver Name</Label>
            <Input
              id="name"
              placeholder="Enter caregiver name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {!isVanityProfile && (
            <div className="space-y-2">
              <Label htmlFor="email">Caregiver Email (Optional)</Label>
              <Input
                id="email"
                type="email"
                placeholder="caregiver@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          )}

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="vanity-profile"
              checked={isVanityProfile}
              onChange={(e) => setIsVanityProfile(e.target.checked)}
              className="rounded border-gray-300"
            />
            <Label htmlFor="vanity-profile">
              Add as reference only (no invitation will be sent)
            </Label>
          </div>

          <Button 
            onClick={handleSubmit}
            disabled={loading || !name}
            className="w-full"
          >
            {loading ? "Adding..." : "Add Caregiver"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}