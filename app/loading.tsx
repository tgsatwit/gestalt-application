import { Loader2 } from "lucide-react"

// Mark as dynamic to prevent static optimization
export const dynamic = 'force-dynamic'

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  )
}