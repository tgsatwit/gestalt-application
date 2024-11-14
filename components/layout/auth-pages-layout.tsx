interface AuthPagesLayoutProps {
  children: React.ReactNode
}

export function AuthPagesLayout({ children }: AuthPagesLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      {children}
    </div>
  )
}