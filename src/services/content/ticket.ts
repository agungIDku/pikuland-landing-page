import { TICKET_PAGE_FALLBACK } from "@/data/ticketDefaults";
import type {
  TicketCheckoutFormContent,
  TicketCheckoutPageContent,
  TicketCheckoutVisitorForm,
  TicketContent,
  TicketFnqContent,
  TicketFnqItem,
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

function htmlField(v: unknown, fallback: string): string {
  if (v === undefined || v === null) return fallback;
  const s = String(v).trim();
  return s || fallback;
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

function parseFnq(raw: unknown, d: TicketFnqContent): TicketFnqContent {
  if (!raw || typeof raw !== "object") return d;
  const o = raw as Record<string, unknown>;
  const title = str(o.title) || d.title;
  const itemsRaw = o.items;
  if (!Array.isArray(itemsRaw) || itemsRaw.length === 0) {
    return { title, items: d.items };
  }
  const items: TicketFnqItem[] = [];
  for (const row of itemsRaw) {
    if (!row || typeof row !== "object") continue;
    const r = row as Record<string, unknown>;
    const question = str(r.question);
    const answer =
      r.answer !== undefined && r.answer !== null
        ? String(r.answer).trim()
        : "";
    if (question && answer) items.push({ question, answer });
  }
  return { title, items: items.length ? items : d.items };
}

function parseSteps(raw: unknown, d: TicketStepsContent): TicketStepsContent {
  if (!raw || typeof raw !== "object") return d;
  const o = raw as Record<string, unknown>;
  return {
    step1Label: str(o.step1Label) || d.step1Label,
    step2Label: str(o.step2Label) || d.step2Label,
    step3Label: str(o.step3Label) || d.step3Label,
  };
}

function parseVisitor(
  raw: unknown,
  d: TicketCheckoutVisitorForm,
): TicketCheckoutVisitorForm {
  if (!raw || typeof raw !== "object") return d;
  const o = raw as Record<string, unknown>;
  return {
    label: str(o.label) || d.label,
    detailInfo: str(o.detailInfo) || d.detailInfo,
  };
}

function parseCheckoutFormFields(
  raw: unknown,
  d: TicketCheckoutFormContent,
): TicketCheckoutFormContent {
  if (!raw || typeof raw !== "object") return d;
  const o = raw as Record<string, unknown>;
  const ticketInfoStr = str(o.ticketInformation);
  const ticketInformation =
    !ticketInfoStr || ticketInfoStr === "-" ? "" : ticketInfoStr;

  return {
    chooseDateLabel: str(o.chooseDateLabel) || d.chooseDateLabel,
    dateInformation: htmlField(o.dateInformation, d.dateInformation),
    totalVisitorsLabel: str(o.totalVisitorsLabel) || d.totalVisitorsLabel,
    children: parseVisitor(o.children, d.children),
    adult: parseVisitor(o.adult, d.adult),
    buttonBackLabel: str(o.buttonBackLabel) || d.buttonBackLabel,
    buttonSubmitLabel: str(o.buttonSubmitLabel) || d.buttonSubmitLabel,
    ticketInformation,
  };
}

function parseTicketCheckoutPage(
  raw: unknown,
  d: TicketCheckoutPageContent,
): TicketCheckoutPageContent {
  if (!raw || typeof raw !== "object") return d;
  const o = raw as Record<string, unknown>;
  return {
    title: str(o.title) || d.title,
    description: htmlField(o.description, d.description),
    form: parseCheckoutFormFields(o.form, d.form),
  };
}

export function normalizeTicketContent(json: unknown): TicketContent {
  const d = TICKET_PAGE_FALLBACK;
  const raw = extractTicketContent(json);
  if (!raw) return d;

  const fnqRaw = raw.fnq ?? raw.faq;

  return {
    title: str(raw.title) || d.title,
    description: htmlField(raw.description, d.description),
    cheapestPriceLabel: str(raw.cheapestPriceLabel) || d.cheapestPriceLabel,
    chooseTicketLabel: str(raw.chooseTicketLabel) || d.chooseTicketLabel,
    fnq: parseFnq(fnqRaw, d.fnq),
    steps: parseSteps(raw.steps, d.steps),
    ticketCheckoutPage: parseTicketCheckoutPage(
      raw.ticketCheckoutPage,
      d.ticketCheckoutPage,
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
  try {
    const json = await withRetry(getPageContentTicket, 1);
    return normalizeTicketContent(json);
  } catch (err) {
    console.error("[fetchTicketContent]", err);
    return TICKET_PAGE_FALLBACK;
  }
});
