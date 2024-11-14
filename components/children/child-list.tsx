"use client"

import { Child } from "@/lib/types"
import { ChildCard } from "./child-card"
import { Loader2 } from "lucide-react"

interface ChildListProps {
  children: Child[]
  loading: boolean
  onUpdate: (id: string, data: Partial<Child>) => Promise<void>
  onDelete: (id: string) => Promise<void>
  onAddSpecialist: (childId: string, specialistData: { 
    email?: string; 
    name: string;
    status?: 'pending' | 'accepted';
  }) => Promise<void>
  onRemoveSpecialist: (childId: string, specialistEmail: string) => Promise<void>
  onAddCaregiver: (childId: string, caregiverData: { 
    email?: string; 
    name: string;
    status?: 'pending' | 'accepted';
  }) => Promise<void>
  onRemoveCaregiver: (childId: string, caregiverEmail: string) => Promise<void>
}

export function ChildList({ 
  children, 
  loading, 
  onUpdate, 
  onDelete,
  onAddSpecialist,
  onRemoveSpecialist,
  onAddCaregiver,
  onRemoveCaregiver,
}: ChildListProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (children.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <p className="text-2xl font-semibold">No children profiles yet</p>
        <p className="text-muted-foreground">
          Add your first child profile to get started
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {children.map((child) => (
        <ChildCard
          key={child.id}
          child={child}
          onUpdate={onUpdate}
          onDelete={onDelete}
          onAddSpecialist={onAddSpecialist}
          onRemoveSpecialist={onRemoveSpecialist}
          onAddCaregiver={onAddCaregiver}
          onRemoveCaregiver={onRemoveCaregiver}
        />
      ))}
    </div>
  )
}