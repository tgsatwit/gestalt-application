"use client"

import { Child } from "@/lib/types"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChildForm } from "./child-form"
import { AddSpecialistDialog } from "./add-specialist-dialog"
import { AddCaregiverDialog } from "./add-caregiver-dialog"
import { PendingConnectionActions } from "./pending-connection-actions"
import { UnlinkConnection } from "./unlink-connection"
import { format } from "date-fns"
import { MoreVertical, Pencil, Trash2 } from "lucide-react"
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
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/hooks/use-auth"

interface ChildCardProps {
  child: Child
  onUpdate: (id: string, data: Partial<Child>) => Promise<void>
  onDelete: (id: string) => Promise<void>
  onAddSpecialist: (childId: string, specialistData: { 
    email?: string; 
    name: string;
    status?: 'pending' | 'accepted';
  }) => Promise<void>
  onRemoveSpecialist: (childId: string, specialistIdentifier: string) => Promise<void>
  onAddCaregiver: (childId: string, caregiverData: { 
    email?: string; 
    name: string;
    status?: 'pending' | 'accepted';
  }) => Promise<void>
  onRemoveCaregiver: (childId: string, caregiverIdentifier: string) => Promise<void>
}

export function ChildCard({ 
  child, 
  onUpdate, 
  onDelete,
  onAddSpecialist,
  onRemoveSpecialist,
  onAddCaregiver,
  onRemoveCaregiver,
}: ChildCardProps) {
  const { user } = useAuth()
  const isPrimaryParent = user?.id === child.parentIds[0]

  const handleUpdate = async (data: Partial<Child>) => {
    await onUpdate(child.id, data)
  }

  const handleDelete = async () => {
    await onDelete(child.id)
  }

  const formatDate = (dateString: string | Date | undefined) => {
    if (!dateString) return "No date set"
    try {
      const date = new Date(dateString)
      return isNaN(date.getTime()) ? "Invalid date" : format(date, "PPP")
    } catch {
      return "Invalid date"
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <div>
          <CardTitle>{child.name}</CardTitle>
          <CardDescription>
            Born {formatDate(child.dateOfBirth)}
          </CardDescription>
        </div>
        {isPrimaryParent && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <Dialog>
                <DialogTrigger asChild>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Child Profile</DialogTitle>
                    <DialogDescription>
                      Make changes to your child's profile here
                    </DialogDescription>
                  </DialogHeader>
                  <ChildForm
                    initialData={child}
                    onSubmit={handleUpdate}
                  />
                </DialogContent>
              </Dialog>
              <DropdownMenuSeparator />
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem
                    onSelect={(e) => e.preventDefault()}
                    className="text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete your
                      child's profile and remove all associated data.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      className="bg-destructive text-destructive-foreground"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </CardHeader>
      <CardContent>
        {child.notes && (
          <div className="mb-4">
            <p className="text-sm text-muted-foreground">{child.notes}</p>
          </div>
        )}

        <Tabs defaultValue="specialists" className="space-y-4">
          <TabsList>
            <TabsTrigger value="specialists">Specialists</TabsTrigger>
            <TabsTrigger value="caregivers">Caregivers</TabsTrigger>
          </TabsList>

          <TabsContent value="specialists">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold">Specialists</h4>
                {isPrimaryParent && (
                  <AddSpecialistDialog 
                    child={child}
                    onAddSpecialist={onAddSpecialist}
                  />
                )}
              </div>

              <div className="space-y-2">
                {child.pendingSpecialists?.map((specialist) => (
                  <div
                    key={specialist.uid || specialist.email || specialist.name}
                    className="flex items-center justify-between rounded-lg border p-2"
                  >
                    <div>
                      <p className="text-sm font-medium">{specialist.name}</p>
                      <Badge variant="secondary" className="mt-1">
                        {specialist.status}
                      </Badge>
                    </div>
                    {isPrimaryParent && (
                      <div className="flex items-center space-x-2">
                        {specialist.email && specialist.status === 'pending' && (
                          <PendingConnectionActions
                            childId={child.id}
                            recipientEmail={specialist.email}
                            type="specialist"
                            onRemove={() => onRemoveSpecialist(child.id, specialist.email!)}
                          />
                        )}
                        {specialist.status === 'accepted' && (
                          <UnlinkConnection
                            childId={child.id}
                            childName={child.name}
                            connectionId={specialist.uid || specialist.name}
                            connectionName={specialist.name}
                            type="specialist"
                          />
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="caregivers">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold">Caregivers</h4>
                {isPrimaryParent && (
                  <AddCaregiverDialog 
                    child={child}
                    onAddCaregiver={onAddCaregiver}
                  />
                )}
              </div>

              <div className="space-y-2">
                {child.pendingCaregivers?.map((caregiver) => (
                  <div
                    key={caregiver.uid || caregiver.email || caregiver.name}
                    className="flex items-center justify-between rounded-lg border p-2"
                  >
                    <div>
                      <p className="text-sm font-medium">{caregiver.name}</p>
                      <Badge variant="secondary" className="mt-1">
                        {caregiver.status}
                      </Badge>
                    </div>
                    {isPrimaryParent && (
                      <div className="flex items-center space-x-2">
                        {caregiver.email && caregiver.status === 'pending' && (
                          <PendingConnectionActions
                            childId={child.id}
                            recipientEmail={caregiver.email}
                            type="caregiver"
                            onRemove={() => onRemoveCaregiver(child.id, caregiver.email!)}
                          />
                        )}
                        {caregiver.status === 'accepted' && (
                          <UnlinkConnection
                            childId={child.id}
                            childName={child.name}
                            connectionId={caregiver.uid || caregiver.name}
                            connectionName={caregiver.name}
                            type="caregiver"
                          />
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}