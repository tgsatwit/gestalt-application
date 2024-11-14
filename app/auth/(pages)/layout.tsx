import { AuthPagesLayout } from "@/components/layout/auth-pages-layout"

export default function AuthPagesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AuthPagesLayout>{children}</AuthPagesLayout>
}