import type {
  CheckoutApiResponse,
  VisitsApiResponse,
  VisitsData,
} from "./visitsCheckoutTypes";

/** `YYYY-MM-DD` in local timezone. */
export function formatDateParamForVisits(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export async function fetchVisitsClient(input: {
  date: string;
  article: string;
}): Promise<VisitsData> {
  const res = await fetch("/api/ticketing/visits", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ date: input.date, article: input.article }),
    cache: "no-store",
  });
  const text = await res.text();
  let json: VisitsApiResponse;
  try {
    json = JSON.parse(text) as VisitsApiResponse;
  } catch {
    throw new Error(`Respons kunjungan tidak valid (${res.status})`);
  }
  if (!res.ok) {
    throw new Error(
      json.message || `Gagal memuat detail harga (${res.status})`,
    );
  }
  if (json.result === false) {
    throw new Error(json.message || "Gagal memuat detail harga.");
  }
  if (!json.data || typeof json.data !== "object") {
    throw new Error(json.message || "Data kunjungan tidak tersedia.");
  }
  return json.data;
}

export async function fetchCheckoutClient(input: {
  cust_name: string;
  email: string;
  phone: string;
  sku: string;
  qty_child: string;
  qty_adult: string;
  total_payment: string;
  /** Tanggal kunjungan, format `YYYY-MM-DD` (lokal). */
  visit_date: string;
}): Promise<CheckoutApiResponse["data"]> {
  const res = await fetch("/api/ticketing/checkout", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
    cache: "no-store",
  });
  const text = await res.text();
  let json: CheckoutApiResponse;
  try {
    json = JSON.parse(text) as CheckoutApiResponse;
  } catch {
    throw new Error(`Respons checkout tidak valid (${res.status})`);
  }
  if (!res.ok) {
    throw new Error(json.message || `Checkout gagal (${res.status})`);
  }
  if (!json.result || !json.data) {
    throw new Error(json.message || "Checkout tidak berhasil.");
  }
  return json.data;
}
