/**
 * `data.content` from `GET client/pages/career` (page detail envelope).
 */
export interface CareerValueBlock {
  title: string;
  description: string;
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
}
