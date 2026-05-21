import { TICKET_PAGE_FALLBACK } from "@/data/ticketDefaults";
import type { Lang } from "@/types/lang";
import type {
  TicketBookingActionsContent,
  TicketBookingContactFormContent,
  TicketBookingReviewContent,
  TicketCalendarContent,
  TicketCalendarWeekdaysContent,
  TicketCheckoutFormContent,
  TicketCheckoutPageContent,
  TicketCheckoutVisitorForm,
  TicketContent,
  TicketFnqContent,
  TicketFnqItem,
  TicketFormMessagesContent,
  TicketPageSeoContent,
  TicketProductCardsContent,
  TicketSelectedTicketContent,
  TicketStep3IntroContent,
  TicketStepsContent,
} from "@/types/ticketContent";
import { cache } from "react";

import { getLang } from "../lang";
import { proxyUrl } from "../proxyUrl";
import { withRetry } from "../withRetry";

function str(v: unknown): string {
  if (v == null || v === "") return "";
  return String(v).trim();
}

/** CMS may return a plain string (API localized) or `{ id, en }`. */
function pickLocalized(
  v: unknown,
  lang: Lang,
  fallback: string,
): string {
  if (v == null || v === "") return fallback;
  if (typeof v === "string") {
    const s = v.trim();
    return s || fallback;
  }
  if (typeof v === "object" && !Array.isArray(v)) {
    const o = v as Record<string, unknown>;
    const primary = lang === "en" ? str(o.en) : str(o.id);
    const alt = lang === "en" ? str(o.id) : str(o.en);
    return primary || alt || fallback;
  }
  return fallback;
}

function htmlLocalized(v: unknown, lang: Lang, fallback: string): string {
  return pickLocalized(v, lang, fallback) || fallback;
}

function extractTicketContent(
  json: unknown,
): Record<string, unknown> | undefined {
  if (!json || typeof json !== "object") return undefined;
  const root = json as Record<string, unknown>;
  const data = root.data;
  if (data && typeof data === "object" && !Array.isArray(data)) {
    const d = data as Record<string, unknown>;
    const content = d.content;
    if (content && typeof content === "object" && !Array.isArray(content)) {
      return content as Record<string, unknown>;
    }
  }
  return undefined;
}

function parseFnq(raw: unknown, lang: Lang, d: TicketFnqContent): TicketFnqContent {
  if (!raw || typeof raw !== "object") return d;
  const o = raw as Record<string, unknown>;
  const title = pickLocalized(o.title, lang, d.title);
  const itemsRaw = o.items;
  if (!Array.isArray(itemsRaw) || itemsRaw.length === 0) {
    return { title, items: d.items };
  }
  const items: TicketFnqItem[] = [];
  for (const row of itemsRaw) {
    if (!row || typeof row !== "object") continue;
    const r = row as Record<string, unknown>;
    const question = pickLocalized(r.question, lang, "");
    const answer = pickLocalized(r.answer, lang, "");
    if (question && answer) items.push({ question, answer });
  }
  return { title, items: items.length ? items : d.items };
}

function parseSteps(
  raw: unknown,
  lang: Lang,
  d: TicketStepsContent,
): TicketStepsContent {
  if (!raw || typeof raw !== "object") return d;
  const o = raw as Record<string, unknown>;
  return {
    step1Label: pickLocalized(o.step1Label, lang, d.step1Label),
    step2Label: pickLocalized(o.step2Label, lang, d.step2Label),
    step3Label: pickLocalized(o.step3Label, lang, d.step3Label),
  };
}

function parseVisitor(
  raw: unknown,
  lang: Lang,
  d: TicketCheckoutVisitorForm,
): TicketCheckoutVisitorForm {
  if (!raw || typeof raw !== "object") return d;
  const o = raw as Record<string, unknown>;
  return {
    label: pickLocalized(o.label, lang, d.label),
    detailInfo: pickLocalized(o.detailInfo, lang, d.detailInfo),
  };
}

function parseCheckoutFormFields(
  raw: unknown,
  lang: Lang,
  d: TicketCheckoutFormContent,
): TicketCheckoutFormContent {
  if (!raw || typeof raw !== "object") return d;
  const o = raw as Record<string, unknown>;
  const ticketInfoStr = pickLocalized(o.ticketInformation, lang, "");
  const ticketInformation =
    !ticketInfoStr || ticketInfoStr === "-" ? "" : ticketInfoStr;

  return {
    chooseDateLabel: pickLocalized(o.chooseDateLabel, lang, d.chooseDateLabel),
    dateInformation: htmlLocalized(o.dateInformation, lang, d.dateInformation),
    totalVisitorsLabel: pickLocalized(
      o.totalVisitorsLabel,
      lang,
      d.totalVisitorsLabel,
    ),
    children: parseVisitor(o.children, lang, d.children),
    adult: parseVisitor(o.adult, lang, d.adult),
    buttonBackLabel: pickLocalized(o.buttonBackLabel, lang, d.buttonBackLabel),
    buttonSubmitLabel: pickLocalized(
      o.buttonSubmitLabel,
      lang,
      d.buttonSubmitLabel,
    ),
    ticketInformation,
  };
}

function parseTicketCheckoutPage(
  raw: unknown,
  lang: Lang,
  d: TicketCheckoutPageContent,
): TicketCheckoutPageContent {
  if (!raw || typeof raw !== "object") return d;
  const o = raw as Record<string, unknown>;
  return {
    title: pickLocalized(o.title, lang, d.title),
    description: htmlLocalized(o.description, lang, d.description),
    form: parseCheckoutFormFields(o.form, lang, d.form),
  };
}

function parseSeo(
  raw: unknown,
  lang: Lang,
  d: TicketPageSeoContent,
): TicketPageSeoContent {
  if (!raw || typeof raw !== "object") return d;
  const o = raw as Record<string, unknown>;
  return {
    metaTitle: pickLocalized(o.metaTitle, lang, d.metaTitle),
    metaDescription: pickLocalized(o.metaDescription, lang, d.metaDescription),
  };
}

function parseStep3Intro(
  raw: unknown,
  lang: Lang,
  d: TicketStep3IntroContent,
): TicketStep3IntroContent {
  if (!raw || typeof raw !== "object") return d;
  const o = raw as Record<string, unknown>;
  return {
    description: htmlLocalized(o.description, lang, d.description),
  };
}

function parseProductCards(
  raw: unknown,
  lang: Lang,
  d: TicketProductCardsContent,
): TicketProductCardsContent {
  if (!raw || typeof raw !== "object") return d;
  const o = raw as Record<string, unknown>;
  return {
    emptyMessage: pickLocalized(o.emptyMessage, lang, d.emptyMessage),
    sellingPriceLabel: pickLocalized(
      o.sellingPriceLabel,
      lang,
      d.sellingPriceLabel,
    ),
    productFallbackPrefix: pickLocalized(
      o.productFallbackPrefix,
      lang,
      d.productFallbackPrefix,
    ),
  };
}

function parseSelectedTicket(
  raw: unknown,
  lang: Lang,
  d: TicketSelectedTicketContent,
): TicketSelectedTicketContent {
  if (!raw || typeof raw !== "object") return d;
  const o = raw as Record<string, unknown>;
  return {
    caption: pickLocalized(o.caption, lang, d.caption),
    loadingPriceHint: pickLocalized(
      o.loadingPriceHint,
      lang,
      d.loadingPriceHint,
    ),
    priceAdjustedHint: pickLocalized(
      o.priceAdjustedHint,
      lang,
      d.priceAdjustedHint,
    ),
  };
}

function parseCalendarWeekdays(
  raw: unknown,
  lang: Lang,
  d: TicketCalendarWeekdaysContent,
): TicketCalendarWeekdaysContent {
  if (!raw || typeof raw !== "object") return d;
  const o = raw as Record<string, unknown>;
  return {
    sun: pickLocalized(o.sun, lang, d.sun),
    mon: pickLocalized(o.mon, lang, d.mon),
    tue: pickLocalized(o.tue, lang, d.tue),
    wed: pickLocalized(o.wed, lang, d.wed),
    thu: pickLocalized(o.thu, lang, d.thu),
    fri: pickLocalized(o.fri, lang, d.fri),
    sat: pickLocalized(o.sat, lang, d.sat),
  };
}

function parseCalendar(
  raw: unknown,
  lang: Lang,
  d: TicketCalendarContent,
): TicketCalendarContent {
  if (!raw || typeof raw !== "object") return d;
  const o = raw as Record<string, unknown>;
  return {
    prevMonthAria: pickLocalized(o.prevMonthAria, lang, d.prevMonthAria),
    nextMonthAria: pickLocalized(o.nextMonthAria, lang, d.nextMonthAria),
    weekdays: parseCalendarWeekdays(o.weekdays, lang, d.weekdays),
    holidayTooltip: pickLocalized(o.holidayTooltip, lang, d.holidayTooltip),
    holidayLegend: htmlLocalized(o.holidayLegend, lang, d.holidayLegend),
  };
}

function parseFormMessages(
  raw: unknown,
  lang: Lang,
  d: TicketFormMessagesContent,
): TicketFormMessagesContent {
  if (!raw || typeof raw !== "object") return d;
  const o = raw as Record<string, unknown>;
  return {
    selectVisitDateFirst: pickLocalized(
      o.selectVisitDateFirst,
      lang,
      d.selectVisitDateFirst,
    ),
    waitForPriceLoad: pickLocalized(
      o.waitForPriceLoad,
      lang,
      d.waitForPriceLoad,
    ),
    minVisitorsOne: pickLocalized(o.minVisitorsOne, lang, d.minVisitorsOne),
    visitsLoadFailed: pickLocalized(o.visitsLoadFailed, lang, d.visitsLoadFailed),
    fillContactFields: pickLocalized(
      o.fillContactFields,
      lang,
      d.fillContactFields,
    ),
    validEmail: pickLocalized(o.validEmail, lang, d.validEmail),
    phoneMinDigits: pickLocalized(o.phoneMinDigits, lang, d.phoneMinDigits),
    customerHistoryFailed: pickLocalized(
      o.customerHistoryFailed,
      lang,
      d.customerHistoryFailed,
    ),
    fillEachChildName: pickLocalized(
      o.fillEachChildName,
      lang,
      d.fillEachChildName,
    ),
    fillEachAdultName: pickLocalized(
      o.fillEachAdultName,
      lang,
      d.fillEachAdultName,
    ),
    invalidTotal: pickLocalized(o.invalidTotal, lang, d.invalidTotal),
    skuMissing: pickLocalized(o.skuMissing, lang, d.skuMissing),
    bookingNoReference: pickLocalized(
      o.bookingNoReference,
      lang,
      d.bookingNoReference,
    ),
    checkoutFailed: pickLocalized(o.checkoutFailed, lang, d.checkoutFailed),
  };
}

function parseBookingReview(
  raw: unknown,
  lang: Lang,
  d: TicketBookingReviewContent,
): TicketBookingReviewContent {
  if (!raw || typeof raw !== "object") return d;
  const o = raw as Record<string, unknown>;
  return {
    datePrefix: pickLocalized(o.datePrefix, lang, d.datePrefix),
    visitorsPrefix: pickLocalized(o.visitorsPrefix, lang, d.visitorsPrefix),
    childWord: pickLocalized(o.childWord, lang, d.childWord),
    adultWord: pickLocalized(o.adultWord, lang, d.adultWord),
  };
}

function parseBookingContactForm(
  raw: unknown,
  lang: Lang,
  d: TicketBookingContactFormContent,
): TicketBookingContactFormContent {
  if (!raw || typeof raw !== "object") return d;
  const o = raw as Record<string, unknown>;
  return {
    fullNameLabel: pickLocalized(o.fullNameLabel, lang, d.fullNameLabel),
    fullNamePlaceholder: pickLocalized(
      o.fullNamePlaceholder,
      lang,
      d.fullNamePlaceholder,
    ),
    emailLabel: pickLocalized(o.emailLabel, lang, d.emailLabel),
    emailPlaceholder: pickLocalized(
      o.emailPlaceholder,
      lang,
      d.emailPlaceholder,
    ),
    phoneLabel: pickLocalized(o.phoneLabel, lang, d.phoneLabel),
    phonePlaceholder: pickLocalized(
      o.phonePlaceholder,
      lang,
      d.phonePlaceholder,
    ),
    phoneHelpText: pickLocalized(o.phoneHelpText, lang, d.phoneHelpText),
    contactSectionTitle: pickLocalized(
      o.contactSectionTitle,
      lang,
      d.contactSectionTitle,
    ),
    childSectionTitle: pickLocalized(
      o.childSectionTitle,
      lang,
      d.childSectionTitle,
    ),
    childNamesHint: pickLocalized(o.childNamesHint, lang, d.childNamesHint),
    childNameLabelPrefix: pickLocalized(
      o.childNameLabelPrefix,
      lang,
      d.childNameLabelPrefix,
    ),
    childNamePlaceholderPrefix: pickLocalized(
      o.childNamePlaceholderPrefix,
      lang,
      d.childNamePlaceholderPrefix,
    ),
    noChildTicketsMessage: pickLocalized(
      o.noChildTicketsMessage,
      lang,
      d.noChildTicketsMessage,
    ),
    adultSectionTitle: pickLocalized(
      o.adultSectionTitle,
      lang,
      d.adultSectionTitle,
    ),
    adultNamesHint: pickLocalized(o.adultNamesHint, lang, d.adultNamesHint),
    adultNameLabelPrefix: pickLocalized(
      o.adultNameLabelPrefix,
      lang,
      d.adultNameLabelPrefix,
    ),
    adultNamePlaceholderPrefix: pickLocalized(
      o.adultNamePlaceholderPrefix,
      lang,
      d.adultNamePlaceholderPrefix,
    ),
    noAdultTicketsMessage: pickLocalized(
      o.noAdultTicketsMessage,
      lang,
      d.noAdultTicketsMessage,
    ),
  };
}

function parseBookingActions(
  raw: unknown,
  lang: Lang,
  d: TicketBookingActionsContent,
): TicketBookingActionsContent {
  if (!raw || typeof raw !== "object") return d;
  const o = raw as Record<string, unknown>;
  return {
    back: pickLocalized(o.back, lang, d.back),
    next: pickLocalized(o.next, lang, d.next),
    nextLoading: pickLocalized(o.nextLoading, lang, d.nextLoading),
    submit: pickLocalized(o.submit, lang, d.submit),
    submitLoading: pickLocalized(o.submitLoading, lang, d.submitLoading),
  };
}

export function normalizeTicketContent(
  json: unknown,
  lang: Lang,
): TicketContent {
  const d = TICKET_PAGE_FALLBACK;
  const raw = extractTicketContent(json);
  if (!raw) return d;

  const fnqRaw = raw.fnq ?? raw.faq;

  return {
    title: pickLocalized(raw.title, lang, d.title),
    description: htmlLocalized(raw.description, lang, d.description),
    cheapestPriceLabel: pickLocalized(
      raw.cheapestPriceLabel,
      lang,
      d.cheapestPriceLabel,
    ),
    chooseTicketLabel: pickLocalized(
      raw.chooseTicketLabel,
      lang,
      d.chooseTicketLabel,
    ),
    fnq: parseFnq(fnqRaw, lang, d.fnq),
    steps: parseSteps(raw.steps, lang, d.steps),
    ticketCheckoutPage: parseTicketCheckoutPage(
      raw.ticketCheckoutPage,
      lang,
      d.ticketCheckoutPage,
    ),
    seo: parseSeo(raw.seo, lang, d.seo),
    step3Intro: parseStep3Intro(raw.step3Intro, lang, d.step3Intro),
    productCards: parseProductCards(raw.productCards, lang, d.productCards),
    selectedTicket: parseSelectedTicket(
      raw.selectedTicket,
      lang,
      d.selectedTicket,
    ),
    calendar: parseCalendar(raw.calendar, lang, d.calendar),
    formMessages: parseFormMessages(raw.formMessages, lang, d.formMessages),
    bookingReview: parseBookingReview(raw.bookingReview, lang, d.bookingReview),
    bookingContactForm: parseBookingContactForm(
      raw.bookingContactForm,
      lang,
      d.bookingContactForm,
    ),
    bookingActions: parseBookingActions(
      raw.bookingActions,
      lang,
      d.bookingActions,
    ),
  };
}

async function getPageContentTicket(): Promise<unknown> {
  const lang = await getLang();
  const res = await fetch(proxyUrl(`client/pages/ticket?lang=${lang}`), {
    cache: "no-store",
    headers: { "Accept-Language": lang },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch page content for: ticket`);
  }

  return res.json();
}

/**
 * Ticket page CMS (`data.content`), merged with {@link TICKET_PAGE_FALLBACK} for missing fields.
 */
export const fetchTicketContent = cache(async function fetchTicketContent(): Promise<TicketContent> {
  const lang = await getLang();
  try {
    const json = await withRetry(getPageContentTicket, 1);
    return normalizeTicketContent(json, lang);
  } catch (err) {
    console.error("[fetchTicketContent]", err);
    return TICKET_PAGE_FALLBACK;
  }
});
