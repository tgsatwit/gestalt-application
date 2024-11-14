"use client"

import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/contexts/auth-context"
import { MessagingProvider } from "@/contexts/messaging-context"
import { Toaster } from "@/components/ui/sonner"

interface AppShellProps {
  children: React.ReactNode
}

export function AppShell({ children }: AppShellProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <AuthProvider>
        <MessagingProvider>
          {children}
          <Toaster />
        </MessagingProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}