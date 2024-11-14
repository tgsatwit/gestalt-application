import Link from "next/link"

export function AuthFooter() {
  return (
    <footer className="border-t py-6">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <p className="text-sm text-muted-foreground">
          © 2024 Gestalt. All rights reserved.
        </p>
        <nav className="flex gap-4">
          <Link className="text-sm text-muted-foreground hover:underline" href="#">
            Privacy Policy
          </Link>
          <Link className="text-sm text-muted-foreground hover:underline" href="#">
            Terms of Service
          </Link>
          <Link className="text-sm text-muted-foreground hover:underline" href="#">
            Support
          </Link>
        </nav>
      </div>
    </footer>
  )
}