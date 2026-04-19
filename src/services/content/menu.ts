import type {
  MenuContent,
  MenuContentApiRaw,
  MenuItem,
  MenuPageApiResponse,
} from "@/types/menuContent";
import { cache } from "react";

import { proxyUrl } from "../proxyUrl";
import { withRetry } from "../withRetry";

const DEFAULT_LANG = "id";

const MENU_ORDER: { href: string; labelKey: keyof NonNullable<MenuContentApiRaw["menus"]> }[] =
  [
    { href: "/", labelKey: "homePageLabel" },
    { href: "/galeri", labelKey: "galleryPageLabel" },
    { href: "/tiket", labelKey: "ticketPageLabel" },
    { href: "/karir", labelKey: "careerPageLabel" },
    { href: "/kontak", labelKey: "contactPageLabel" },
  ];

const DEFAULT_LABELS: Record<(typeof MENU_ORDER)[number]["labelKey"], string> = {
  homePageLabel: "Beranda",
  galleryPageLabel: "Galeri",
  ticketPageLabel: "Tiket",
  careerPageLabel: "Karir",
  contactPageLabel: "Kontak",
};

function normalizeMenuContent(raw: MenuContentApiRaw): MenuContent {
  const logoUrl = raw.logoUrl?.trim() || undefined;

  if (raw.menus != null) {
    const menu: MenuItem[] = MENU_ORDER.map(({ href, labelKey }) => ({
      href,
      label: raw.menus![labelKey] ?? DEFAULT_LABELS[labelKey],
    }));

    return {
      menu,
      navCta: {
        href: "/tiket",
        label: raw.buyTicketButtonLabel?.trim() || "Beli Tiket",
      },
      logoUrl,
    };
  }

  return {
    menu: raw.menu,
    navCta: raw.navCta,
    logoUrl,
  };
}

export async function getPageContentMenu() {
  const lang = DEFAULT_LANG;
  const res = await fetch(proxyUrl(`client/pages/menu?lang=${lang}`), {
    cache: "no-store",
    headers: { "Accept-Language": lang },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch page content for: menu`);
  }

  return res.json() as Promise<MenuPageApiResponse>;
}

/**
 * Fetches header/nav CMS from `client/pages/menu` (server: NEXT_PUBLIC_API_URL; browser: /api/proxy/...).
 * On failure returns undefined so Navbar can fall back to static copy.
 * Wrapped in `cache` so repeated calls in the same request dedupe.
 */
export const fetchMenuContent = cache(async function fetchMenuContent(): Promise<
  MenuContent | undefined
> {
  try {
    const data = await withRetry(getPageContentMenu, 1);
    return normalizeMenuContent(data.data.content);
  } catch (err) {
    console.error("[fetchMenuContent]", err);
    return undefined;
  }
});
