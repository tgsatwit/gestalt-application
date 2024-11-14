import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Let all requests through since we're handling
  // auth checks in the client components with proper redirects
  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/specialist/:path*', '/auth/:path*']
}