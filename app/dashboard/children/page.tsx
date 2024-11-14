"use client"

import { useChildren } from "@/hooks/use-children"
import { ChildList } from "@/components/children/child-list"
import { ChildForm } from "@/components/children/child-form"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Loader2 } from "lucide-react"

export default function ChildrenPage() {
  const { 
    children, 
    loading, 
    addChild, 
    updateChild, 
    deleteChild,
    addSpecialist,
    removeSpecialist,
    addCaregiver,
    removeCaregiver,
  } = useChildren()
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login")
    }
  }, [authLoading, user, router])

  if (loading || authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Children</h2>
          <p className="text-muted-foreground">
            Manage your children's profiles and track their progress
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Child
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Child Profile</DialogTitle>
              <DialogDescription>
                Create a new profile for your child to track their progress
              </DialogDescription>
            </DialogHeader>
            <ChildForm onSubmit={addChild} />
          </DialogContent>
        </Dialog>
      </div>

      <ChildList 
        children={children}
        loading={loading}
        onUpdate={updateChild}
        onDelete={deleteChild}
        onAddSpecialist={addSpecialist}
        onRemoveSpecialist={removeSpecialist}
        onAddCaregiver={addCaregiver}
        onRemoveCaregiver={removeCaregiver}
      />
    </div>
  )
}