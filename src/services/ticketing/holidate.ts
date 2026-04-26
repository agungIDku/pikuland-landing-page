import type { HolidateApiResponse } from "./holidateTypes";

export type { HolidateApiResponse } from "./holidateTypes";

/**
 * Local calendar key `YYYY-MM-DD` for a cell built from year/monthIndex/day.
 */
export function localDateKeyFromCalendarParts(
  year: number,
  monthIndex: number,
  day: number,
): string {
  return `${year}-${String(monthIndex + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

/** `YYYY-MM-DD` in the user's local timezone from an API ISO `holidate` string. */
export function localDateKeyFromHolidateIso(iso: string): string | null {
  const t = Date.parse(iso);
  if (!Number.isFinite(t)) return null;
  const d = new Date(t);
  return localDateKeyFromCalendarParts(
    d.getFullYear(),
    d.getMonth(),
    d.getDate(),
  );
}

export function buildHolidateKeySet(dates: string[]): Set<string> {
  const s = new Set<string>();
  for (const iso of dates) {
    const k = localDateKeyFromHolidateIso(iso);
    if (k) s.add(k);
  }
  return s;
}

export function parseHolidateResponse(text: string): HolidateApiResponse | null {
  try {
    return JSON.parse(text) as HolidateApiResponse;
  } catch {
    return null;
  }
}

/** Request body for `POST /v1/holidate` — `month` is calendar month 1–12 (string), per API. */
export function holidateRequestBodyForMonth(month1to12: number): string {
  return JSON.stringify({ month: String(month1to12) });
}

/**
 * Fetches holidate via the first-party route for the month shown in the calendar.
 * Use from the client when `viewDate` changes (not from RSC).
 */
export async function fetchHolidateForMonthClient(
  month1to12: number,
): Promise<string[]> {
  if (month1to12 < 1 || month1to12 > 12) return [];
  const res = await fetch("/api/ticketing/holidate", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: holidateRequestBodyForMonth(month1to12),
    cache: "no-store",
  });
  const text = await res.text();
  if (!res.ok) return [];
  const parsed = parseHolidateResponse(text);
  if (!parsed || !Array.isArray(parsed.data)) return [];
  const out: string[] = [];
  for (const row of parsed.data) {
    if (row && typeof row === "object" && "holidate" in row) {
      const v = (row as { holidate: unknown }).holidate;
      if (typeof v === "string" && v.trim()) out.push(v.trim());
    }
  }
  return out;
}
