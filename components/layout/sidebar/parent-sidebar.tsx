import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Brain, Calendar, Home, LineChart, MessageCircle, Settings, Users, Flag, Baby, Users2 } from "lucide-react"
import Link from "next/link"

interface ParentSidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function ParentSidebar({ className }: ParentSidebarProps) {
  return (
    <div className={cn("pb-12", className)}>
      <div className="space-y-4 py-4">
        <div className="px-4 py-2">
          <h2 className="mb-2 px-2 text-xl font-semibold tracking-tight">
            Dashboard
          </h2>
          <div className="space-y-1">
            <Link href="/dashboard">
              <Button variant="ghost" className="w-full justify-start">
                <Home className="mr-2 h-4 w-4" />
                Overview
              </Button>
            </Link>
            <Link href="/dashboard/children">
              <Button variant="ghost" className="w-full justify-start">
                <Baby className="mr-2 h-4 w-4" />
                Children
              </Button>
            </Link>
            <Link href="/dashboard/progress">
              <Button variant="ghost" className="w-full justify-start">
                <LineChart className="mr-2 h-4 w-4" />
                Progress Tracking
              </Button>
            </Link>
            <Link href="/dashboard/milestones">
              <Button variant="ghost" className="w-full justify-start">
                <Flag className="mr-2 h-4 w-4" />
                Milestones
              </Button>
            </Link>
            <Link href="/dashboard/sessions">
              <Button variant="ghost" className="w-full justify-start">
                <Calendar className="mr-2 h-4 w-4" />
                Sessions
              </Button>
            </Link>
          </div>
        </div>
        <div className="px-4 py-2">
          <h2 className="mb-2 px-2 text-xl font-semibold tracking-tight">
            Community
          </h2>
          <div className="space-y-1">
            <Link href="/dashboard/community">
              <Button variant="ghost" className="w-full justify-start">
                <Users2 className="mr-2 h-4 w-4" />
                Forum
              </Button>
            </Link>
            <Link href="/dashboard/activities">
              <Button variant="ghost" className="w-full justify-start">
                <Brain className="mr-2 h-4 w-4" />
                Activities
              </Button>
            </Link>
            <Link href="/dashboard/specialists">
              <Button variant="ghost" className="w-full justify-start">
                <Users className="mr-2 h-4 w-4" />
                Find Specialists
              </Button>
            </Link>
            <Link href="/dashboard/messages">
              <Button variant="ghost" className="w-full justify-start">
                <MessageCircle className="mr-2 h-4 w-4" />
                Messages
              </Button>
            </Link>
          </div>
        </div>
        <div className="px-4 py-2">
          <h2 className="mb-2 px-2 text-xl font-semibold tracking-tight">
            Settings
          </h2>
          <Button variant="ghost" className="w-full justify-start">
            <Settings className="mr-2 h-4 w-4" />
            Preferences
          </Button>
        </div>
      </div>
    </div>
  )
}