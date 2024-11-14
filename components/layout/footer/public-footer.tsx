import Link from "next/link"
import { Brain } from "lucide-react"

export function PublicFooter() {
  return (
    <footer className="border-t">
      <div className="container px-4 py-12 md:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <Link className="flex items-center" href="/">
              <Brain className="h-6 w-6" />
              <span className="ml-2 text-xl font-bold">Gestalt</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Supporting your child's language journey with expert guidance and AI-powered assistance.
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Product</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link className="text-muted-foreground hover:underline" href="#">
                  Features
                </Link>
              </li>
              <li>
                <Link className="text-muted-foreground hover:underline" href="#">
                  Pricing
                </Link>
              </li>
              <li>
                <Link className="text-muted-foreground hover:underline" href="#">
                  Resources
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link className="text-muted-foreground hover:underline" href="#">
                  About
                </Link>
              </li>
              <li>
                <Link className="text-muted-foreground hover:underline" href="#">
                  Blog
                </Link>
              </li>
              <li>
                <Link className="text-muted-foreground hover:underline" href="#">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link className="text-muted-foreground hover:underline" href="#">
                  Privacy
                </Link>
              </li>
              <li>
                <Link className="text-muted-foreground hover:underline" href="#">
                  Terms
                </Link>
              </li>
              <li>
                <Link className="text-muted-foreground hover:underline" href="#">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © 2024 Gestalt. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}