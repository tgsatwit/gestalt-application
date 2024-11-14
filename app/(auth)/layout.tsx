import { AuthLayout } from "@/components/layout/auth-layout"
import { MobileNav } from "@/components/layout/mobile-nav"

export default function AuthRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <AuthLayout>{children}</AuthLayout>
      <MobileNav />
    </>
  )
}