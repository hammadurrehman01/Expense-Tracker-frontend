import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isLoggedIn = request.cookies.get("customer_loggedin")?.value === "true";

  const isEmailVerified =
    request.cookies.get("email_verification_status")?.value === "true";

  if (
    isLoggedIn &&
    isEmailVerified &&
    [
      "/login",
      "/register",
      "/verify-email",
      "/reset-password",
      "/forgot-password",
    ].includes(pathname)
  ) {
    return NextResponse.redirect(new URL("/user/dashboard", request.url));
  }

  if (
    !isLoggedIn &&
    (pathname.startsWith("/user/") || pathname === "verify-email")
  ) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (
    !isLoggedIn &&
    pathname === "/reset-password" &&
    !request.nextUrl.searchParams.has("token")
  ) {
    return NextResponse.redirect(new URL("/forgot-password", request.url));
  }

  if (
    isLoggedIn &&
    !isEmailVerified &&
    (["/login", "/register", "/forgot-password", "/reset-password"].includes(
      pathname
    ) ||
      pathname.startsWith("/user/"))
  ) {
    return NextResponse.redirect(new URL("/verify-email", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/register",
    "/verify-email",
    "/forgot-password",
    "/reset-password",
    "/user/:path*",
  ],
};
