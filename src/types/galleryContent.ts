/**
 * Gallery page CMS (`GET client/pages/gallery?lang=id` → `data.content`).
 */
export interface GalleryImageItem {
  /** Image URL (remote or path under `/public`). */
  src: string;
  alt: string;
  category?: string;
}

export interface GalleryContent {
  title: string;
  /** Plain text (e.g. stripped from HTML for accessibility / non-HTML views). */
  subtitle: string;
  /** When CMS sends HTML in `description`, render this in the hero (e.g. `<p>...</p>`). */
  subtitleHtml?: string;
  /** Tab labels for filters; should include a catch-all like "Semua" if used. */
  categories: string[];
  images: GalleryImageItem[];
}

export type GalleryContentApiRaw = Partial<GalleryContent> & {
  description?: string;
  items?: unknown;
};

export interface GalleryPageApiResponse {
  data: {
    content: GalleryContentApiRaw;
  };
}
