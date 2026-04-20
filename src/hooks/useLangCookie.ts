"use client";

import type { Lang } from "@/types/lang";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";

/**
 * Active locale from `lang` cookie (`en` | `id`), aligned with `LanguageSwitcher`.
 * Defaults to `id` until mounted, then reads the cookie.
 */
export function useLangCookie(): Lang {
  const [lang, setLang] = useState<Lang>("id");

  useEffect(() => {
    setLang(Cookies.get("lang") === "en" ? "en" : "id");
  }, []);

  return lang;
}
