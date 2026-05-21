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

export interface TicketPageSeoContent {
  metaTitle: string;
  metaDescription: string;
}

export interface TicketStep3IntroContent {
  /** HTML */
  description: string;
}

export interface TicketProductCardsContent {
  emptyMessage: string;
  sellingPriceLabel: string;
  productFallbackPrefix: string;
}

export interface TicketSelectedTicketContent {
  caption: string;
  loadingPriceHint: string;
  priceAdjustedHint: string;
}

export interface TicketCalendarWeekdaysContent {
  sun: string;
  mon: string;
  tue: string;
  wed: string;
  thu: string;
  fri: string;
  sat: string;
}

export interface TicketCalendarContent {
  prevMonthAria: string;
  nextMonthAria: string;
  weekdays: TicketCalendarWeekdaysContent;
  holidayTooltip: string;
  /** HTML */
  holidayLegend: string;
}

export interface TicketFormMessagesContent {
  selectVisitDateFirst: string;
  waitForPriceLoad: string;
  minVisitorsOne: string;
  visitsLoadFailed: string;
  fillContactFields: string;
  validEmail: string;
  phoneMinDigits: string;
  customerHistoryFailed: string;
  fillEachChildName: string;
  fillEachAdultName: string;
  invalidTotal: string;
  skuMissing: string;
  bookingNoReference: string;
  checkoutFailed: string;
}

export interface TicketBookingReviewContent {
  datePrefix: string;
  visitorsPrefix: string;
  childWord: string;
  adultWord: string;
}

export interface TicketBookingContactFormContent {
  fullNameLabel: string;
  fullNamePlaceholder: string;
  emailLabel: string;
  emailPlaceholder: string;
  phoneLabel: string;
  phonePlaceholder: string;
  phoneHelpText: string;
  contactSectionTitle: string;
  childSectionTitle: string;
  childNamesHint: string;
  childNameLabelPrefix: string;
  childNamePlaceholderPrefix: string;
  noChildTicketsMessage: string;
  adultSectionTitle: string;
  adultNamesHint: string;
  adultNameLabelPrefix: string;
  adultNamePlaceholderPrefix: string;
  noAdultTicketsMessage: string;
}

export interface TicketBookingActionsContent {
  back: string;
  next: string;
  nextLoading: string;
  submit: string;
  submitLoading: string;
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
  seo: TicketPageSeoContent;
  step3Intro: TicketStep3IntroContent;
  productCards: TicketProductCardsContent;
  selectedTicket: TicketSelectedTicketContent;
  calendar: TicketCalendarContent;
  formMessages: TicketFormMessagesContent;
  bookingReview: TicketBookingReviewContent;
  bookingContactForm: TicketBookingContactFormContent;
  bookingActions: TicketBookingActionsContent;
}
