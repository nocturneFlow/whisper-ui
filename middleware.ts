import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  // Check if the route requires authentication
  const protectedRoutes = ["/tools"];
  const pathname = request.nextUrl.pathname;

  // Check if current path is a protected route
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );
  if (isProtectedRoute) {
    // Check for the backend session cookie only
    const sessionCookie = request.cookies.get("audio_transcription_session");

    // If no session found, redirect to sign-in
    if (!sessionCookie) {
      const signInUrl = new URL("/sign-in", request.url);
      signInUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(signInUrl);
    }
  }

  // Check if accessing auth pages while already authenticated
  const authRoutes = ["/sign-in", "/sign-up"];
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));
  if (isAuthRoute) {
    const sessionCookie = request.cookies.get("audio_transcription_session");

    // If authenticated, redirect to chat
    if (sessionCookie) {
      return NextResponse.redirect(new URL("/tools", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
};
