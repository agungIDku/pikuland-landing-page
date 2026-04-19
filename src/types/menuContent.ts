/**
 * Menu / header CMS payload (inside `data.content` from GET client/pages/menu).
 */
export interface MenuItem {
  href: string;
  label: string;
}

/** Primary CTA in navbar (e.g. Beli Tiket). Optional; defaults apply when omitted. */
export interface MenuNavCta {
  href: string;
  label: string;
}

/** Labels per route as returned by CMS (`menus` object). */
export interface MenuLabelsFromApi {
  careerPageLabel?: string;
  contactPageLabel?: string;
  galleryPageLabel?: string;
  homePageLabel?: string;
  ticketPageLabel?: string;
}

/**
 * Raw `data.content` shapes: legacy `{ menu, navCta }` or CMS `{ menus, logoUrl, buyTicketButtonLabel }`.
 */
export type MenuContentApiRaw = {
  buyTicketButtonLabel?: string;
  logoUrl?: string;
  menus?: MenuLabelsFromApi;
  menu?: MenuItem[];
  navCta?: MenuNavCta;
};

export interface MenuContent {
  menu?: MenuItem[];
  navCta?: MenuNavCta;
  /** Header logo from CMS (e.g. ImageKit). Falls back to static asset in Navbar when absent. */
  logoUrl?: string;
}

export interface MenuPageApiResponse {
  data: {
    content: MenuContentApiRaw;
  };
}
