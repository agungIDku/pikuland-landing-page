import "server-only";

import {
  callTicketingProductsUpstream,
  parseTicketingProductsResponse,
} from "./callTicketingProductsUpstream";
import { sortTicketingProducts, type TicketingProduct } from "./products";

export type LoadTicketingProductsResult = {
  products: TicketingProduct[];
  error: string | null;
};

/**
 * Fetches and sorts products on the server for the `/tiket` page (SEO-friendly first paint).
 */
export async function loadTicketingProductsForPage(): Promise<LoadTicketingProductsResult> {
  const { status, body } = await callTicketingProductsUpstream("{}");

  if (status === 500) {
    try {
      const errJson = JSON.parse(body) as { error?: string };
      if (errJson?.error?.includes("not configured")) {
        return { products: [], error: "Layanan tiket belum diatur (env)." };
      }
    } catch {
      // fall through
    }
  }

  if (status < 200 || status >= 300) {
    return {
      products: [],
      error: `Gagal memuat daftar tiket (${status}).`,
    };
  }

  const parsed = parseTicketingProductsResponse(body);
  if (!parsed) {
    return { products: [], error: "Respon tiket tidak valid." };
  }

  if (!Array.isArray(parsed.data)) {
    return { products: [], error: null };
  }

  return {
    products: sortTicketingProducts(parsed.data),
    error: null,
  };
}
