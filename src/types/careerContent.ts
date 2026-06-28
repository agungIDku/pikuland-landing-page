/**
 * `data.content` from `GET client/pages/career` (page detail envelope).
 */
export interface CareerValueBlock {
  title: string;
  description: string;
}

/** Static UI labels rendered inside each job card. */
export interface CareerJobCardLabels {
  /** Prefix before the job location, e.g. `Lokasi:` */
  location: string;
  /** Heading above the qualification list, e.g. `Kualifikasi:` */
  qualifications: string;
  /** Prompt above the application email, e.g. `Kirim CV kamu ke :` */
  sendCv: string;
  /** Prefix before the closing date, e.g. `*Lowongan Berakhir` */
  dueDatePrefix: string;
}

export interface CareerContent {
  title: string;
  preTitle: string;
  /** Section heading above job list */
  openPositionLabel: string;
  /** Intro HTML from CMS, e.g. `<p>...</p>` */
  description: string;
  /** Three value cards (order: first → second → third). */
  values: [CareerValueBlock, CareerValueBlock, CareerValueBlock];
  /** Static labels for the job listing cards. */
  jobCard: CareerJobCardLabels;
}
