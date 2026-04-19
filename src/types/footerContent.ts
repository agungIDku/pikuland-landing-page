/**
 * Footer CMS: `GET client/pages/footer?lang=id` → `data.content`.
 *
 * Supports nested payload: `description`, `explore` / `importantInformation` (with `items[]` using `link` + `title`),
 * `contact` (with `whatsappNumber`), `socialMedia[]` (`icon` + `url`), and optional flat/legacy fields.
 */
export interface FooterLink {
  href: string;
  label: string;
}

export interface FooterSocialLinks {
  instagram?: string;
  facebook?: string;
  youtube?: string;
}

/** Props for `<Footer />` — built only from API via `normalizeFooterContent`. */
export interface FooterContent {
  logoUrl?: string;
  tagline: string;
  exploreTitle: string;
  exploreLinks: FooterLink[];
  importantTitle: string;
  importantLinks: FooterLink[];
  contactTitle: string;
  addressLine: string;
  email: string;
  phone: string;
  whatsappLabel: string;
  whatsappHref: string;
  /** Omitted when API does not send it (e.g. nested CMS payload). */
  copyright?: string;
  social: FooterSocialLinks;
}

/**
 * `data.content` from API: usually the same keys as `FooterContent`, plus optional aliases below.
 */
export type FooterContentApiRaw = Partial<FooterContent> & {
  description?: string;
  jelajahi?: FooterLink[];
  infoPenting?: FooterLink[];
  jelajahiTitle?: string;
  infoPentingTitle?: string;
  hubungiKamiTitle?: string;
  address?: string;
  whatsappButtonLabel?: string;
  whatsappUrl?: string;
  copyrightText?: string;
  instagramUrl?: string;
  facebookUrl?: string;
  youtubeUrl?: string;
};

export interface FooterPageApiResponse {
  data: {
    content: FooterContentApiRaw;
  };
}
