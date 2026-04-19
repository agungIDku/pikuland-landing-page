/**
 * Builds full API URL from base (NEXT_PUBLIC_API_URL) and path.
 * Works whether base has a trailing slash or not (e.g. .../api/v1 or .../api/v1/).
 */
export function apiUrl(path: string): string {
  const base = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");
  const normalizedPath = path.startsWith("/") ? path.slice(1) : path;
  return base ? `${base}/${normalizedPath}` : normalizedPath;
}
