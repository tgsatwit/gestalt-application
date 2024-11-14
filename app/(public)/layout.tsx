import { PublicLayout } from "@/components/layout/public-layout"

export default function PublicRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <PublicLayout>{children}</PublicLayout>
}