import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export { default } from "next-auth/middleware";

const PROTECTED_PATHS = ["/create", "/feed", "/profile"];

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXT_AUTH_SECRET! });

  const currentUrl = req.nextUrl;

  if (
    !token &&
    PROTECTED_PATHS.some((path) => currentUrl.pathname.startsWith(path))
  ) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (token && currentUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/create", req.url));
  }
}

export const config = {
  matcher: ["/", "/create", "/feed", "/profile"],
};
