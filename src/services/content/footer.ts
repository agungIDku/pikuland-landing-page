import type {
  FooterContent,
  FooterContentApiRaw,
  FooterLink,
  FooterSocialLinks,
} from "@/types/footerContent";
import { cache } from "react";

import { getLang } from "../lang";
import { proxyUrl } from "../proxyUrl";
import { withRetry } from "../withRetry";

/** Map CMS paths to app routes (`/ticket` → `/tiket`, etc.). */
const APP_PATH_ALIASES: Record<string, string> = {
  "/ticket": "/tiket",
  "/gallery": "/galeri",
  "/career": "/karir",
  "/contact": "/kontak",
};

function normalizeAppPath(href: string): string {
  if (!href.startsWith("/")) return href;
  const mapped = APP_PATH_ALIASES[href.toLowerCase()];
  return mapped ?? href;
}

function str(v: unknown): string {
  if (v == null || v === "") return "";
  return String(v).trim();
}

function waMeFromPhone(v: unknown): string {
  const s = str(v);
  if (!s) return "";
  const digits = s.replace(/\D/g, "");
  if (!digits) return "";
  return `https://wa.me/${digits}`;
}

function mapSocialMedia(v: unknown): FooterSocialLinks {
  if (!Array.isArray(v)) return {};
  const social: FooterSocialLinks = {};
  for (const row of v) {
    if (!row || typeof row !== "object") continue;
    const o = row as Record<string, unknown>;
    const icon = str(o.icon).toLowerCase();
    const url = str(o.url);
    if (!url) continue;
    if (icon === "instagram") social.instagram = url;
    else if (icon === "facebook") social.facebook = url;
    else if (icon === "youtube") social.youtube = url;
  }
  return social;
}

/**
 * Supports `{ data: { content } }`, `{ data: { ...footer } }` (content at `data`),
 * and `{ content }` / root footer object.
 */
function extractFooterPayload(json: unknown): FooterContentApiRaw | undefined {
  if (!json || typeof json !== "object") return undefined;
  const root = json as Record<string, unknown>;

  const data = root.data;
  if (data && typeof data === "object") {
    const d = data as Record<string, unknown>;
    const nested = d.content;
    if (nested && typeof nested === "object") {
      return nested as FooterContentApiRaw;
    }
    if (
      "exploreLinks" in d ||
      "jelajahi" in d ||
      "tagline" in d ||
      "importantLinks" in d ||
      "explore" in d ||
      "importantInformation" in d ||
      "description" in d
    ) {
      return d as FooterContentApiRaw;
    }
  }

  const topContent = root.content;
  if (topContent && typeof topContent === "object") {
    return topContent as FooterContentApiRaw;
  }

  if (
    "exploreLinks" in root ||
    "jelajahi" in root ||
    "tagline" in root ||
    "importantLinks" in root ||
    "explore" in root ||
    "importantInformation" in root ||
    "description" in root
  ) {
    return root as FooterContentApiRaw;
  }

  return undefined;
}

function parseFooterLink(item: unknown): FooterLink | undefined {
  if (!item || typeof item !== "object") return undefined;
  const o = item as Record<string, unknown>;
  const hrefRaw = str(o.href ?? o.url ?? o.path ?? o.link);
  const label = str(o.label ?? o.title ?? o.name ?? o.text);
  const href = normalizeAppPath(hrefRaw);
  if (!href || !label) return undefined;
  return { href, label };
}

function sanitizeLinks(links: unknown): FooterLink[] | undefined {
  if (!Array.isArray(links)) return undefined;
  const out = links
    .map(parseFooterLink)
    .filter((x): x is FooterLink => x != null);
  return out.length ? out : undefined;
}

function mergeSocialFromApi(raw: FooterContentApiRaw): FooterSocialLinks {
  const fromNested = raw.social;
  return {
    instagram: str(raw.instagramUrl) || str(fromNested?.instagram) || undefined,
    facebook: str(raw.facebookUrl) || str(fromNested?.facebook) || undefined,
    youtube: str(raw.youtubeUrl) || str(fromNested?.youtube) || undefined,
  };
}

/**
 * Nested CMS shape: `explore`, `importantInformation`, `contact`, `socialMedia`, `description`.
 */
function mapNestedFooterCms(
  r: Record<string, unknown>,
): FooterContent | undefined {
  const explore = r.explore;
  const importantInformation = r.importantInformation;
  const contact = r.contact;

  if (
    !explore ||
    typeof explore !== "object" ||
    !importantInformation ||
    typeof importantInformation !== "object" ||
    !contact ||
    typeof contact !== "object"
  ) {
    return undefined;
  }

  const ex = explore as Record<string, unknown>;
  const im = importantInformation as Record<string, unknown>;
  const co = contact as Record<string, unknown>;

  const exploreLinks = sanitizeLinks(ex.items);
  const importantLinks = sanitizeLinks(im.items);

  if (!exploreLinks?.length || !importantLinks?.length) return undefined;

  const tagline = str(r.description ?? r.tagline);
  const exploreTitle = str(ex.titleLabel ?? ex.title);
  const importantTitle = str(im.titleLabel ?? im.title);
  const contactTitle = str(co.titleLabel ?? co.contactTitle);
  const addressLine = str(co.address);
  const email = str(co.email);
  const phone = str(co.phone);
  const whatsappLabel = str(
    co.whatsappButtonLabel ?? co.whatsappLabel ?? co.whatsapp_button_label,
  );
  const whatsappHref =
    str(co.whatsappHref ?? co.whatsappUrl) ||
    waMeFromPhone(co.whatsappNumber ?? co.whatsapp_number);

  const socialFromArray = mapSocialMedia(r.socialMedia);
  const socialFlat = mergeSocialFromApi(r as FooterContentApiRaw);
  const social: FooterSocialLinks = {
    instagram: socialFromArray.instagram ?? socialFlat.instagram,
    facebook: socialFromArray.facebook ?? socialFlat.facebook,
    youtube: socialFromArray.youtube ?? socialFlat.youtube,
  };

  const copyright = str(r.copyright ?? r.copyrightText);

  if (
    !tagline ||
    !exploreTitle ||
    !importantTitle ||
    !contactTitle ||
    !addressLine ||
    !email ||
    !phone ||
    !whatsappLabel ||
    !whatsappHref
  ) {
    return undefined;
  }

  return {
    logoUrl: str(r.logoUrl) || undefined,
    tagline,
    exploreTitle,
    exploreLinks,
    importantTitle,
    importantLinks,
    contactTitle,
    addressLine,
    email,
    phone,
    whatsappLabel,
    whatsappHref,
    copyright: copyright || undefined,
    social,
  };
}

/**
 * Maps CMS payload to `FooterContent`, or `undefined` if required fields are missing.
 */
export function normalizeFooterContent(
  raw: FooterContentApiRaw | undefined,
): FooterContent | undefined {
  if (!raw) return undefined;

  const r = raw as Record<string, unknown>;

  const nested = mapNestedFooterCms(r);
  if (nested) return nested;

  const exploreLinks =
    sanitizeLinks(r.exploreLinks ?? r.explore_links) ??
    sanitizeLinks(raw.jelajahi);
  const importantLinks =
    sanitizeLinks(r.importantLinks ?? r.important_links) ??
    sanitizeLinks(raw.infoPenting);

  if (!exploreLinks?.length || !importantLinks?.length) return undefined;

  const tagline = str(raw.tagline ?? raw.description ?? r.tag_line);
  const exploreTitle = str(
    raw.exploreTitle ??
      raw.jelajahiTitle ??
      r.explore_title ??
      r.jelajahi_title,
  );
  const importantTitle = str(
    raw.importantTitle ??
      raw.infoPentingTitle ??
      r.important_title ??
      r.info_penting_title,
  );
  const contactTitle = str(
    raw.contactTitle ??
      raw.hubungiKamiTitle ??
      r.contact_title ??
      r.hubungi_kami_title,
  );
  const addressLine = str(
    raw.addressLine ?? raw.address ?? r.address_line ?? r.address,
  );
  const email = str(raw.email ?? r.email_address);
  const phone = str(raw.phone ?? r.phone_number);
  const whatsappLabel = str(
    raw.whatsappLabel ??
      raw.whatsappButtonLabel ??
      r.whatsapp_label ??
      r.whatsapp_button_label,
  );
  const whatsappHref = str(
    raw.whatsappHref ?? raw.whatsappUrl ?? r.whatsapp_href ?? r.whatsapp_url,
  );
  const copyright = str(raw.copyright ?? raw.copyrightText ?? r.copyright_text);

  if (
    !tagline ||
    !exploreTitle ||
    !importantTitle ||
    !contactTitle ||
    !addressLine ||
    !email ||
    !phone ||
    !whatsappLabel ||
    !whatsappHref
  ) {
    return undefined;
  }

  return {
    logoUrl: str(raw.logoUrl ?? r.logo_url) || undefined,
    tagline,
    exploreTitle,
    exploreLinks,
    importantTitle,
    importantLinks,
    contactTitle,
    addressLine,
    email,
    phone,
    whatsappLabel,
    whatsappHref,
    copyright: copyright || undefined,
    social: mergeSocialFromApi(raw),
  };
}

export async function getPageContentFooter(): Promise<unknown> {
  const lang = await getLang();
  const res = await fetch(proxyUrl(`client/pages/footer?lang=${lang}`), {
    cache: "no-store",
    headers: { "Accept-Language": lang },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch page content for: footer`);
  }

  return res.json();
}

/**
 * Fetches footer CMS from `client/pages/footer`.
 * Returns `undefined` when the request fails or the payload is incomplete.
 */
export const fetchFooterContent = cache(
  async function fetchFooterContent(): Promise<FooterContent | undefined> {
    try {
      const json = await withRetry(getPageContentFooter, 1);
      const raw = extractFooterPayload(json);
      return normalizeFooterContent(raw);
    } catch (err) {
      console.error("[fetchFooterContent]", err);
      return undefined;
    }
  },
);
