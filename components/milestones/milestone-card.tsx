"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Milestone } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { MilestoneForm } from "./milestone-form";
import { Pencil } from "lucide-react";
import { useChildren } from "@/hooks/use-children";

interface MilestoneCardProps {
  milestone: Milestone;
  onUpdate: (id: string, data: Partial<Milestone>) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
}

export function MilestoneCard({ milestone, onUpdate, onDelete }: MilestoneCardProps) {
  const { children } = useChildren();
  const child = children.find(c => c.id === milestone.childId);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/10 text-green-500 hover:bg-green-500/20";
      case "in-progress":
        return "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20";
      case "past-due":
        return "bg-red-500/10 text-red-500 hover:bg-red-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20";
    }
  };

  const getDateLabel = (status: string) => {
    switch (status) {
      case "completed":
        return "Date completed";
      default:
        return "Target date";
    }
  };

  const formatDate = (date: string | Date | undefined) => {
    if (!date) return "No date set";
    try {
      const dateObj = new Date(date);
      return isNaN(dateObj.getTime()) ? "Invalid date" : format(dateObj, "PPP");
    } catch {
      return "Invalid date";
    }
  };

  const handleUpdate = async (data: Omit<Milestone, 'id'>) => {
    await onUpdate(milestone.id, data);
  };

  return (
    <Card className="w-full">
      <CardHeader className="space-y-2">
        <div className="flex flex-col space-y-2">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <h3 className="text-lg font-semibold">{milestone.title}</h3>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">{milestone.category}</Badge>
                <Badge className={getStatusColor(milestone.status)}>{milestone.status}</Badge>
                {child && (
                  <Badge variant="secondary">{child.name}</Badge>
                )}
                {milestone.specialistCanView && (
                  <Badge variant="outline" className="bg-blue-500/10 text-blue-500">
                    Visible to Specialists
                  </Badge>
                )}
              </div>
            </div>
            <MilestoneForm 
              mode="edit" 
              initialData={milestone} 
              onSubmit={handleUpdate}
              onDelete={onDelete}
              trigger={
                <Button variant="ghost" size="icon">
                  <Pencil className="h-4 w-4" />
                </Button>
              }
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{milestone.description}</p>
        <div className="flex flex-col space-y-2">
          <span className="text-sm font-medium">
            {getDateLabel(milestone.status)}: {formatDate(milestone.date)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}