import { SpecialistLayout } from "@/components/layout/specialist-layout"
import { MobileNav } from "@/components/layout/mobile-nav"

export default function SpecialistRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <SpecialistLayout>{children}</SpecialistLayout>
      <MobileNav />
    </>
  )
}