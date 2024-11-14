"use client"

import { useState } from "react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { ParentSidebar } from "./sidebar/parent-sidebar"
import { SpecialistSidebar } from "./sidebar/specialist-sidebar"
import { AdminSidebar } from "./sidebar/admin-sidebar"

export function MobileNav() {
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
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden fixed bottom-4 right-4 h-12 w-12 rounded-full shadow-lg bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0">
        {getSidebar()}
      </SheetContent>
    </Sheet>
  )
}