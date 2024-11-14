"use client"

import { Milestone } from '@/lib/types'
import { Calendar } from "@/components/ui/calendar"
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

interface MilestoneCalendarProps {
  milestones: Milestone[]
}

export function MilestoneCalendar({ milestones }: MilestoneCalendarProps) {
  const [date, setDate] = useState<Date | undefined>(new Date())

  const milestoneDates = milestones.reduce((acc, milestone) => {
    const date = new Date(milestone.date)
    const dateStr = date.toISOString().split('T')[0]
    if (!acc[dateStr]) {
      acc[dateStr] = []
    }
    acc[dateStr].push(milestone)
    return acc
  }, {} as Record<string, Milestone[]>)

  const selectedDateMilestones = date
    ? milestoneDates[date.toISOString().split('T')[0]] || []
    : []

  return (
    <div className="flex gap-8">
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="rounded-md border"
        modifiers={{
          milestone: (date) => {
            const dateStr = date.toISOString().split('T')[0]
            return !!milestoneDates[dateStr]
          },
        }}
        modifiersStyles={{
          milestone: {
            fontWeight: 'bold',
            backgroundColor: 'hsl(var(--primary) / 0.1)',
            color: 'hsl(var(--primary))',
          },
        }}
      />
      <Card className="flex-1">
        <CardContent className="p-6">
          <h3 className="font-semibold mb-4">
            {date ? date.toLocaleDateString('en-US', { 
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }) : 'Select a date'}
          </h3>
          <ScrollArea className="h-[400px] pr-4">
            {selectedDateMilestones.length === 0 ? (
              <p className="text-muted-foreground text-sm">No milestones for this date</p>
            ) : (
              <div className="space-y-4">
                {selectedDateMilestones.map((milestone) => (
                  <div
                    key={milestone.id}
                    className="p-4 rounded-lg border bg-card text-card-foreground"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{milestone.title}</h4>
                      <Badge variant="secondary">{milestone.category}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {milestone.description}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}