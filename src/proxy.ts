import { NextRequest, NextResponse } from "next/server";
import { readRoleFromToken } from "@/lib/session-token";

const USER_PATHS = new Set(["/notes"]);

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("burhan_session")?.value;
  const role = token ? await readRoleFromToken(token) : null;
  const isPublic =
    pathname === "/" ||
    pathname === "/login" ||
    pathname === "/u" ||
    pathname.startsWith("/u/");

  if (!role) {
    if (pathname === "/notes") {
      return NextResponse.redirect(new URL("/u", request.url));
    }
    if (!isPublic) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  if (role === "user") {
    if (pathname === "/notes") return NextResponse.next();
    return NextResponse.redirect(new URL("/notes", request.url));
  }

  if (isPublic || USER_PATHS.has(pathname)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
