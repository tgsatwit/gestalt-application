"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Milestone } from '@/lib/types'
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
import { useAuth } from "@/hooks/use-auth"
import { useChildren } from "@/hooks/use-children"
import { toast } from "sonner"

interface MilestoneFormProps {
  onSubmit: (milestone: Omit<Milestone, 'id'>) => void
  onDelete?: (id: string) => Promise<void>
  initialData?: Milestone
  mode?: 'create' | 'edit'
  trigger?: React.ReactNode
}

export function MilestoneForm({ onSubmit, onDelete, initialData, mode = 'create', trigger }: MilestoneFormProps) {
  const [open, setOpen] = useState(false)
  const { user } = useAuth()
  const { children } = useChildren()
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    date: initialData?.date ? new Date(initialData.date).toISOString().split('T')[0] : '',
    category: initialData?.category || '',
    status: initialData?.status || 'in-progress',
    childId: initialData?.childId || (children.length === 1 ? children[0].id : ''),
    specialistCanView: initialData?.specialistCanView || false,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    if (!formData.childId) {
      toast.error("Please select a child for this milestone")
      return
    }

    const milestone = {
      ...formData,
      attachments: initialData?.attachments || [],
      userId: user.id,
      createdAt: new Date(),
    } as Omit<Milestone, 'id'>
    
    onSubmit(milestone)
    setOpen(false)
    if (mode === 'create') {
      setFormData({ 
        title: '', 
        description: '', 
        date: '', 
        category: '', 
        status: 'in-progress', 
        childId: children.length === 1 ? children[0].id : '',
        specialistCanView: false,
      })
    }
  }

  const handleDelete = async () => {
    if (onDelete && initialData) {
      await onDelete(initialData.id)
      setOpen(false)
    }
  }

  if (children.length === 0) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {trigger || <Button>{mode === 'create' ? 'Add New Milestone' : 'Edit Milestone'}</Button>}
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>No Child Profiles</DialogTitle>
            <DialogDescription>
              You need to add a child profile before creating milestones. Please add a child profile first.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || <Button>{mode === 'create' ? 'Add New Milestone' : 'Edit Milestone'}</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{mode === 'create' ? 'Add Milestone' : 'Edit Milestone'}</DialogTitle>
            <DialogDescription>
              {mode === 'create' ? 'Create a new milestone' : 'Update milestone details'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="child">Child</Label>
              <Select
                value={formData.childId}
                onValueChange={(value) => setFormData({ ...formData, childId: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select child" />
                </SelectTrigger>
                <SelectContent>
                  {children.map((child) => (
                    <SelectItem key={child.id} value={child.id}>
                      {child.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="date">Target Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="language">Language</SelectItem>
                  <SelectItem value="social">Social</SelectItem>
                  <SelectItem value="cognitive">Cognitive</SelectItem>
                  <SelectItem value="motor">Motor</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="past-due">Past Due</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="specialist-view">Allow Specialists to View</Label>
              <Switch
                id="specialist-view"
                checked={formData.specialistCanView}
                onCheckedChange={(checked) => setFormData({ ...formData, specialistCanView: checked })}
              />
            </div>
          </div>
          <DialogFooter className="flex justify-between items-center">
            {mode === 'edit' && onDelete && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" type="button">Delete</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the milestone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
            <Button type="submit">{mode === 'create' ? 'Create Milestone' : 'Save Changes'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}