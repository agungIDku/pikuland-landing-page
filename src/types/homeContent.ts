/**
 * Home page CMS payload (inside `data.content` from GET client/pages/home).
 */
export interface HomeHeaderContent {
  button: string;
  /** Destination for the hero CTA button (e.g. "/tiket"). */
  buttonHref?: string;
  /** HTML snippet, e.g. `<p>...<strong>...</strong>...</p>` */
  title: string;
  /** Hero background image for desktop (>= md). */
  bannerImageDesktopUrl?: string;
  /** Hero background image for mobile (< md). */
  bannerImageMobileUrl?: string;
}

export interface HomeRideContent {
  buttonSeeAllRides: string;
  /** Destination for the "see all rides" button (e.g. "/tiket"). */
  buttonSeeAllRidesHref?: string;
  preTitle: string;
  title: string;
}

export interface HomeTestimonialItem {
  imageUrl: string;
  name: string;
  role: string;
  star: number;
  testimonial: string;
}

export interface HomeTestimonialContent {
  items: HomeTestimonialItem[];
  title: string;
}

export interface HomeVideoContent {
  videoDescription: string;
  videoUrl: string;
}

export interface HomeCtaContent {
  button: string;
  /** Destination for the CTA banner button (e.g. "/tiket"). */
  buttonHref?: string;
  /** HTML snippet, e.g. `<p>...</p>` */
  description: string;
  title: string;
}

export interface HomeContent {
  ctaContent: HomeCtaContent;
  galleryTitle: string;
  headerContent: HomeHeaderContent;
  rideContent: HomeRideContent;
  testimonialContent: HomeTestimonialContent;
  videoContent: HomeVideoContent;
}

export interface HomePageApiResponse {
  data: {
    content: HomeContent;
  };
}
