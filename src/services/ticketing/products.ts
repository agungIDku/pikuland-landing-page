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

function isRecord(x: unknown): x is Record<string, unknown> {
  return x !== null && typeof x === "object" && !Array.isArray(x);
}

/** Mengurai beberapa bentuk `data` yang dipakai API (array langsung / `{ products }` / dll.). */
function extractRawProductList(data: unknown): unknown[] | null {
  if (Array.isArray(data)) return data;
  if (isRecord(data)) {
    if (Array.isArray(data.products)) return data.products;
    if (Array.isArray(data.items)) return data.items;
    if (Array.isArray(data.records)) return data.records;
    // Nested envelope
    if (Array.isArray(data.data)) return data.data;
  }
  return null;
}

function coerceTicketingProduct(x: unknown): TicketingProduct | null {
  if (!isRecord(x)) return null;
  const id =
    typeof x.id === "number" && Number.isFinite(x.id)
      ? x.id
      : Number(x.id);
  if (!Number.isFinite(id)) return null;
  const article = String(x.article ?? "").trim();
  if (!article) return null;

  const statusRaw = x.status;
  const status =
    typeof statusRaw === "number" && Number.isFinite(statusRaw)
      ? statusRaw
      : Number(statusRaw);
  const statusSafe = Number.isFinite(status) ? Math.trunc(status) : 0;

  const selling = String(x.selling_price ?? "").trim() || "0";
  const wholesaleRaw = String(x.wholesale_price ?? "").trim();
  const wholesale = wholesaleRaw || selling;

  return {
    id: Math.trunc(id),
    article,
    article_desc: String(x.article_desc ?? "").trim(),
    status: statusSafe,
    article_alias: String(x.article_alias ?? "").trim(),
    article_color: String(x.article_color ?? "").trim(),
    selling_price: selling,
    wholesale_price: wholesale,
  };
}

/**
 * Normalisasi body JSON API produk (POST `/v1/products`).
 * Menangani `result: false`, `data` sebagai array, atau objek bersarang.
 */
export function normalizeTicketingProductsPayload(parsed: unknown): {
  products: TicketingProduct[];
  error: string | null;
} {
  if (!isRecord(parsed)) {
    return { products: [], error: "Respon tiket tidak valid." };
  }

  if (parsed.result === false) {
    const msg =
      typeof parsed.message === "string" && parsed.message.trim()
        ? parsed.message.trim()
        : "Gagal memuat daftar tiket.";
    return { products: [], error: msg };
  }

  const rawList = extractRawProductList(parsed.data);
  if (rawList === null) {
    return {
      products: [],
      error:
        parsed.result === true
          ? "Format daftar produk tidak dikenali."
          : "Respons tidak berisi daftar tiket.",
    };
  }

  if (rawList.length === 0) {
    return { products: [], error: null };
  }

  const products = rawList
    .map(coerceTicketingProduct)
    .filter((p): p is TicketingProduct => p !== null);

  if (products.length === 0) {
    return {
      products: [],
      error: "Data tiket tidak dapat dibaca (struktur item tidak valid).",
    };
  }

  return { products, error: null };
}

export function parseAndNormalizeTicketingProductsBody(body: string): {
  products: TicketingProduct[];
  error: string | null;
} {
  let parsed: unknown;
  try {
    parsed = JSON.parse(body) as unknown;
  } catch {
    return { products: [], error: "Respon tiket tidak valid (bukan JSON)." };
  }
  return normalizeTicketingProductsPayload(parsed);
}

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
 * Upstream: mis. `POST https://pos-api.pikuland.id/v1/products`.
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
  let parsed: unknown;
  try {
    parsed = text ? (JSON.parse(text) as unknown) : null;
  } catch {
    throw new Error(
      `Ticketing products: expected JSON, got ${res.status}: ${text.slice(0, 200)}`,
    );
  }

  if (!res.ok) {
    const msg =
      isRecord(parsed) && typeof parsed.message === "string"
        ? parsed.message
        : text.slice(0, 500);
    throw new Error(`Ticketing products request failed: ${res.status} ${msg}`);
  }

  const { products, error } = normalizeTicketingProductsPayload(parsed);
  if (error) {
    throw new Error(error);
  }

  const message =
    isRecord(parsed) && typeof parsed.message === "string"
      ? parsed.message
      : "OK";
  const code =
    isRecord(parsed) && typeof parsed.code === "number" ? parsed.code : 200;

  return {
    result: true,
    code,
    message,
    data: products,
  };
}
