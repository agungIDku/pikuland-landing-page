import type { TicketingProductsResponse } from "./products";

const getBase = () =>
  (process.env.PIKULAND_TICKETING_API_URL || "").replace(/\/$/, "");
const getToken = () => process.env.PIKULAND_TICKETING_TOKEN || "";

type TicketingV1Path =
  | "products"
  | "holidate"
  | "visits"
  | "checkout";

async function postTicketingV1(
  path: TicketingV1Path,
  requestBody: string = "{}",
): Promise<{ status: number; body: string }> {
  const base = getBase();
  const token = getToken();
  if (!base || !token) {
    return {
      status: 500,
      body: JSON.stringify({ error: "Ticketing API is not configured" }),
    };
  }

  const url = `${base}/${path}`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: requestBody,
    cache: "no-store",
  });
  const text = await res.text();

  return { status: res.status, body: text };
}

/**
 * POSTs to the upstream `…/products` API (used by the Next route and RSC data loaders).
 * Returns raw `status` + `body` text.
 */
export async function callTicketingProductsUpstream(
  requestBody: string = "{}",
): Promise<{ status: number; body: string }> {
  return postTicketingV1("products", requestBody);
}

/**
 * POSTs to the upstream `…/holidate` API (holiday / special pricing dates for the calendar).
 */
export async function callHolidateUpstream(
  requestBody: string = "{}",
): Promise<{ status: number; body: string }> {
  return postTicketingV1("holidate", requestBody);
}

export async function callVisitsUpstream(
  requestBody: string = "{}",
): Promise<{ status: number; body: string }> {
  return postTicketingV1("visits", requestBody);
}

export async function callCheckoutUpstream(
  requestBody: string = "{}",
): Promise<{ status: number; body: string }> {
  return postTicketingV1("checkout", requestBody);
}

export function parseTicketingProductsResponse(
  text: string,
): TicketingProductsResponse | null {
  try {
    return JSON.parse(text) as TicketingProductsResponse;
  } catch {
    return null;
  }
}
