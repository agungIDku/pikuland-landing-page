/** `data.content` from `GET client/pages/ticket` (CMS uses key `fnq` for FAQ). */
export interface TicketFnqItem {
  question: string;
  answer: string;
}

export interface TicketFnqContent {
  title: string;
  items: TicketFnqItem[];
}

export interface TicketStepsContent {
  step1Label: string;
  step2Label: string;
  step3Label: string;
}

export interface TicketCheckoutVisitorForm {
  label: string;
  detailInfo: string;
}

export interface TicketCheckoutFormContent {
  chooseDateLabel: string;
  /** HTML */
  dateInformation: string;
  totalVisitorsLabel: string;
  children: TicketCheckoutVisitorForm;
  adult: TicketCheckoutVisitorForm;
  buttonBackLabel: string;
  buttonSubmitLabel: string;
  /** Plain or HTML; hide in UI when empty or "-" */
  ticketInformation: string;
}

export interface TicketCheckoutPageContent {
  title: string;
  /** HTML */
  description: string;
  form: TicketCheckoutFormContent;
}

export interface TicketContent {
  title: string;
  /** HTML */
  description: string;
  cheapestPriceLabel: string;
  chooseTicketLabel: string;
  fnq: TicketFnqContent;
  steps: TicketStepsContent;
  ticketCheckoutPage: TicketCheckoutPageContent;
}
