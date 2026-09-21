import { NextRequest, NextResponse } from "next/server";
import { readRoleFromToken } from "@/lib/session-token";

function isUserAppPath(pathname: string) {
  return pathname === "/notes" || pathname.startsWith("/notes/");
}

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
    if (isUserAppPath(pathname)) {
      return NextResponse.redirect(new URL("/u", request.url));
    }
    if (!isPublic) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  if (role === "user") {
    if (isUserAppPath(pathname)) return NextResponse.next();
    return NextResponse.redirect(new URL("/notes", request.url));
  }

  if (isPublic || isUserAppPath(pathname)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
