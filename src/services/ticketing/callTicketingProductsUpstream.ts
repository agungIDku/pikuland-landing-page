/**
 * Base upstream ticketing/POS API, mis. `https://pos-api.pikuland.id/v1`.
 * Jika env hanya berisi origin tanpa path (`https://pos-api.pikuland.id`),
 * `/v1` ditambahkan otomatis agar POST …/products mengarah benar.
 */
function normalizeTicketingBase(raw: string): string {
  const trimmed = raw.trim().replace(/\/+$/, "");
  if (!trimmed) return "";
  try {
    const u = new URL(trimmed);
    const path = u.pathname.replace(/\/+$/, "") || "/";
    if (path === "/") {
      return `${trimmed}/v1`;
    }
    return trimmed;
  } catch {
    return trimmed;
  }
}

const getBase = () => normalizeTicketingBase(process.env.PIKULAND_TICKETING_API_URL || "");
const getToken = () => process.env.PIKULAND_TICKETING_TOKEN || "";

type TicketingV1Path =
  | "products"
  | "holidate"
  | "visits"
  | "checkout"
  | "customers";

/** Respons JSON agar loader tidak throw; pesan dibaca oleh `parseAndNormalize`. */
function upstreamUnreachableBody(err: unknown): string {
  const msg = err instanceof Error ? err.message : String(err);
  const cause =
    err instanceof Error && err.cause instanceof Error
      ? err.cause.message
      : "";
  const combined = `${msg} ${cause}`.toLowerCase();
  const dnsLike =
    combined.includes("enotfound") || combined.includes("getaddrinfo");
  const hint = dnsLike
    ? " Host tidak valid atau typo di env (contoh benar: https://pos-api.pikuland.id/v1 — subdomain pakai titik, bukan pos-api-pikuland.id)."
    : "";
  return JSON.stringify({
    result: false,
    code: 503,
    message: `Tidak dapat menghubungi server tiket.${hint}`,
  });
}

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
  try {
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
  } catch (err) {
    return { status: 503, body: upstreamUnreachableBody(err) };
  }
}

async function getTicketingV1(
  pathAfterBase: string,
): Promise<{ status: number; body: string }> {
  const base = getBase();
  const token = getToken();
  if (!base || !token) {
    return {
      status: 500,
      body: JSON.stringify({ error: "Ticketing API is not configured" }),
    };
  }
  const path = pathAfterBase.replace(/^\//, "");
  const url = `${base}/${path}`;
  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      cache: "no-store",
    });
    const text = await res.text();
    return { status: res.status, body: text };
  } catch (err) {
    return { status: 503, body: upstreamUnreachableBody(err) };
  }
}

/**
 * GET `…/transactions/{id}` (detail transaksi, Bearer auth).
 */
export async function callTransactionDetailUpstream(
  transactionId: string,
): Promise<{ status: number; body: string }> {
  const id = String(transactionId).trim();
  if (!id) {
    return {
      status: 400,
      body: JSON.stringify({ error: "Missing transaction id" }),
    };
  }
  return getTicketingV1(`transactions/${id}`);
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

export async function callCustomersUpstream(
  requestBody: string = "{}",
): Promise<{ status: number; body: string }> {
  return postTicketingV1("customers", requestBody);
}
