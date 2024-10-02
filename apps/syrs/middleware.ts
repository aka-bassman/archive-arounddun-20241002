import { NextRequest, NextResponse } from "next/server";
import { match as matchLocale } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";

const i18n = { defaultLocale: "en", locales: ["en", "ko", "ja", "th"] };
const basePaths = process.env.basePaths ? process.env.basePaths.split(",") : [];

function getLocale(request: NextRequest): string | undefined {
  if (!request.headers.get("accept-language")) return i18n.defaultLocale;
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));
  try {
    const languages = new Negotiator({ headers: negotiatorHeaders }).languages();
    return matchLocale(languages, i18n.locales, i18n.defaultLocale);
  } catch (e) {
    return i18n.defaultLocale;
  }
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );
  if (pathnameIsMissingLocale)
    return NextResponse.redirect(
      new URL(`/${getLocale(request)}/${request.nextUrl.href.split("/").slice(3).join("/")}`, request.url)
    );
  const splits = pathname.split("/");
  const locale = splits[1];
  const basePath = basePaths.includes(splits[2]) ? splits[2] : null;
  const headers = new Headers(request.headers);
  headers.set("x-locale", locale);
  headers.set("x-path", "/" + splits.slice(2).join("/"));
  if (basePath) headers.set("x-base-path", basePath);
  return NextResponse.next({ request: { headers } });
}

export const config = { matcher: ["/((?!api|_next|.*\\..*).*)"] };
