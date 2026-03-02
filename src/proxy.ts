import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { domainLocaleMap, defaultLocale, supportedLocales } from "./lib/domainConfig";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip internal paths
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return;
  }

  // Check if the pathname already starts with a supported locale
  const hasLocale = supportedLocales.some(
    (loc) => pathname.startsWith(`/${loc}/`) || pathname === `/${loc}`
  );

  if (hasLocale || pathname === "/") {
    return;
  }

  const hostname = request.headers.get("host") || "";
  const locale = domainLocaleMap[hostname] || defaultLocale;

  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(url);
}