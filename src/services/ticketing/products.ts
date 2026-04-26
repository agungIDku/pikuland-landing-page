import { appRouteUrl } from "../proxyUrl";

export type TicketingProduct = {
  id: number;
  article: string;
  article_desc: string;
  status: number;
  article_alias: string;
  article_color: string;
  selling_price: string;
  wholesale_price: string;
};

export type TicketingProductsResponse = {
  result: boolean;
  code: number;
  message: string;
  data: TicketingProduct[];
};

/** Formats API `selling_price` (e.g. `"30000.00"`) for display as whole Rupiah. */
export function formatSellingPriceIdr(sellingPrice: string): string {
  const n = Number.parseFloat(String(sellingPrice).replace(",", "."));
  if (!Number.isFinite(n)) return String(sellingPrice).trim();
  return new Intl.NumberFormat("id-ID", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.round(n));
}

export function sortTicketingProducts(
  list: TicketingProduct[],
): TicketingProduct[] {
  return [...list].sort((a, b) => {
    const pa = Number.parseFloat(a.selling_price) || 0;
    const pb = Number.parseFloat(b.selling_price) || 0;
    if (pa !== pb) return pa - pb;
    return a.id - b.id;
  });
}

function productsEndpointUrl(): string {
  if (typeof window !== "undefined") return "/api/ticketing/products";
  return appRouteUrl("/api/ticketing/products");
}

/**
 * Lists ticketing products via the first-party proxy (hides Bearer token, avoids CORS).
 * Mirrors `POST https://api.pikuland.id/v1/products`.
 */
export async function fetchTicketingProducts(
  body: Record<string, unknown> = {},
): Promise<TicketingProductsResponse> {
  const res = await fetch(productsEndpointUrl(), {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  const text = await res.text();
  let json: TicketingProductsResponse;
  try {
    json = JSON.parse(text) as TicketingProductsResponse;
  } catch {
    throw new Error(
      `Ticketing products: expected JSON, got ${res.status}: ${text.slice(0, 200)}`,
    );
  }

  if (!res.ok) {
    throw new Error(
      `Ticketing products request failed: ${res.status} ${text.slice(0, 500)}`,
    );
  }

  return json;
}
