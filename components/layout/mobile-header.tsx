"use client"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { useState } from "react"
import { ParentSidebar } from "./sidebar/parent-sidebar"
import { SpecialistSidebar } from "./sidebar/specialist-sidebar"
import { AdminSidebar } from "./sidebar/admin-sidebar"
import { useAuth } from "@/hooks/use-auth"

export function MobileHeader() {
  const [open, setOpen] = useState(false)
  const { user } = useAuth()

  if (!user) return null

  const getSidebar = () => {
    switch (user.userType) {
      case "specialist":
        return <SpecialistSidebar />
      case "admin":
        return <AdminSidebar />
      default:
        return <ParentSidebar />
    }
  }

  return (
    <div className="md:hidden border-b">
      <div className="flex h-16 items-center px-4">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0">
            {getSidebar()}
          </SheetContent>
        </Sheet>
      </div>
    </div>
  )
}