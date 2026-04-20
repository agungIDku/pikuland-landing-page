/**
 * `data.content` from `GET client/pages/contact` (page detail).
 */
export interface ContactFormContent {
  title: string;
  parentsNameLabel: string;
  parentsNamePlaceholder: string;
  emailLabel: string;
  messageLabel: string;
  messagePlaceholder: string;
  submitButtonLabel: string;
}

export interface ContactLocationContent {
  title: string;
  /** HTML snippet */
  address: string;
  /** Google Maps embed URL */
  mapsUrl?: string;
}

export interface ContactContent {
  title: string;
  /** HTML intro under hero */
  description: string;
  form: ContactFormContent;
  location: ContactLocationContent;
}
