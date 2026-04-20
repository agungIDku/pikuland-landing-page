import type { Lang } from "@/types/lang";
import { cookies } from "next/headers";

export type { Lang } from "@/types/lang";

/**
 * Active locale from `lang` cookie (set by `LanguageSwitcher`).
 * Defaults to Indonesian when missing or invalid.
 */
export async function getLang(): Promise<Lang> {
  const cookieStore = await cookies();
  const value = cookieStore.get("lang")?.value;
  return value === "en" ? "en" : "id";
}
