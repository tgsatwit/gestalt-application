"use client"

import { MilestoneForm } from "@/components/milestones/milestone-form"
import { MilestoneCard } from "@/components/milestones/milestone-card"
import { MilestoneCalendar } from "@/components/milestones/milestone-calendar"
import { useMilestones } from "@/hooks/use-milestones"
import { useAuth } from "@/hooks/use-auth"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function MilestonesPage() {
  const { milestones, loading, addMilestone, updateMilestone, deleteMilestone } = useMilestones()
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
          <h2 className="text-3xl font-bold tracking-tight">Milestones</h2>
          <p className="text-muted-foreground">
            Track and celebrate your child's development journey
          </p>
        </div>
        <MilestoneForm onSubmit={addMilestone} />
      </div>

      <Tabs defaultValue="list">
        <TabsList>
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
        </TabsList>
        <TabsContent value="list" className="space-y-4">
          {milestones.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No milestones yet. Add your first milestone to get started!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {milestones.map((milestone) => (
                <MilestoneCard
                  key={milestone.id}
                  milestone={milestone}
                  onUpdate={updateMilestone}
                  onDelete={deleteMilestone}
                />
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="calendar">
          <MilestoneCalendar milestones={milestones} />
        </TabsContent>
      </Tabs>
    </div>
  )
}