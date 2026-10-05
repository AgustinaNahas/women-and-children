import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { localeFromAcceptLanguage } from "@/lib/locales";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname !== "/") {
    return NextResponse.next();
  }

  const locale = localeFromAcceptLanguage(request.headers.get("accept-language"));
  return NextResponse.redirect(new URL(`/${locale}`, request.url));
}

export const config = {
  matcher: ["/"],
};
