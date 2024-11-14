import { AdminLayout } from "@/components/layout/admin-layout"
import { MobileNav } from "@/components/layout/mobile-nav"

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <AdminLayout>{children}</AdminLayout>
      <MobileNav />
    </>
  )
}