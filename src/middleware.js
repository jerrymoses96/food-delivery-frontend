import { NextResponse } from "next/server";

export function middleware(req) {
  // Get the access token from the cookies
  const token = req.cookies.get("access_token")?.value;

  // Log token to ensure we're getting it
  console.log("Access token:", token);

  // If no token is found, redirect to the login page
  if (!token) {
    console.log("No access token found, redirecting to login");
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Allow the request to proceed if token is present
  return NextResponse.next();
}

// Specify paths to apply middleware
export const config = {
  matcher: [
    "/((?!login|signup|api|_next|static|public|favicon.ico).*)", // Match all pages except these
  ],
};
