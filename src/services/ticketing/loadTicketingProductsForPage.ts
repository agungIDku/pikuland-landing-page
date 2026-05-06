import "server-only";

import { callTicketingProductsUpstream } from "./callTicketingProductsUpstream";
import {
  parseAndNormalizeTicketingProductsBody,
  sortTicketingProducts,
  type TicketingProduct,
} from "./products";

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
    const fallback = parseAndNormalizeTicketingProductsBody(body);
    return {
      products: [],
      error:
        fallback.error ||
        `Gagal memuat daftar tiket (${status}). Periksa URL API dan token di env.`,
    };
  }

  const { products, error } = parseAndNormalizeTicketingProductsBody(body);
  if (error) {
    return { products: [], error };
  }

  return {
    products: sortTicketingProducts(products),
    error: null,
  };
}
