/**
 * Home page CMS payload (inside `data.content` from GET client/pages/home).
 */
export interface HomeHeaderContent {
  button: string;
  /** HTML snippet, e.g. `<p>...<strong>...</strong>...</p>` */
  title: string;
}

export interface HomeRideContent {
  buttonSeeAllRides: string;
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
