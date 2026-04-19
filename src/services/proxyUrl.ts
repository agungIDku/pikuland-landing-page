import { apiUrl } from "./apiUrl";

/**
 * Base URL of this Next.js app (for server-side fetch to our own API routes).
 * In the browser we use relative URL so same-origin works without config.
 */
function getAppBase(): string {
  if (typeof window !== "undefined") return ""; // browser: same-origin
  const url = process.env.NEXT_PUBLIC_APP_URL;
  if (url) return url.replace(/\/$/, "");
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

/**
 * Backend API URL via same-origin proxy in the browser (avoids CORS).
 * On the server, calls the backend directly — avoids SSR self-fetching the
 * public Vercel URL (extra hop, TLS, and env quirks that often break on Vercel).
 */
export function proxyUrl(path: string): string {
  if (typeof window !== "undefined") {
    const normalizedPath = path.startsWith("/") ? path.slice(1) : path;
    return `/api/proxy/${normalizedPath}`;
  }
  return apiUrl(path);
}

/**
 * URL to a first-party `app/api/*` route (server-side fetch needs absolute URL).
 */
export function appRouteUrl(path: string): string {
  const base = getAppBase();
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return base ? `${base}${normalized}` : normalized;
}
