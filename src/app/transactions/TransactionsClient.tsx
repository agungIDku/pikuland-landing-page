"use client";

import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  CreditCard,
  Loader2,
  Package,
  Phone,
  Ticket,
  User,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

/** Clears the fixed `Navbar` (≈88px) so page content is not covered. */
const MAIN_WITH_NAV_OFFSET =
  "min-h-dvh bg-[var(--color-cream)] text-[#1a1a2e] pt-[88px]";

type TransactionRow = {
  id?: number;
  tsact_doc?: string;
  cust_id?: number;
  cust_name?: string | null;
  email?: string | null;
  phone_number?: string | null;
  sku?: string | null;
  qty_adult?: number;
  qty_child?: number;
  total_payment?: number;
  status?: string | null;
  notes?: string | null;
  creation_date?: string | null;
  modification_date?: string | null;
  visit_date?: string | null;
};

type ApiEnvelope = {
  result?: boolean;
  code?: number;
  message?: string;
  data?: unknown;
};

function isRecord(x: unknown): x is Record<string, unknown> {
  return x !== null && typeof x === "object" && !Array.isArray(x);
}

/** Ambil object transaksi dari body API (bisa single atau double envelope). */
function extractTransactionRow(json: unknown): {
  row: TransactionRow | null;
  message?: string;
} {
  if (!isRecord(json)) return { row: null };
  const message =
    typeof json.message === "string" ? json.message : undefined;
  if (json.result === false) return { row: null, message };

  const d = json.data;
  if (!isRecord(d)) return { row: null, message };

  if (isRecord(d.data) && looksLikeTransactionRow(d.data)) {
    return { row: d.data as TransactionRow, message };
  }
  if (looksLikeTransactionRow(d)) {
    return { row: d as TransactionRow, message };
  }
  return { row: null, message };
}

function looksLikeTransactionRow(x: Record<string, unknown>): boolean {
  return (
    typeof x.tsact_doc === "string" ||
    x.id != null ||
    typeof x.cust_name === "string" ||
    x.total_payment != null
  );
}

function formatIdrRupiah(n: number | null | undefined): string {
  if (n == null || !Number.isFinite(Number(n))) return "—";
  return new Intl.NumberFormat("id-ID", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.round(Number(n)));
}

function formatIdDateTime(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(d);
}

function formatIdDateOnly(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);
}

function statusBadgeClass(status: string | null | undefined): string {
  const s = (status ?? "").toLowerCase();
  if (s === "settlement" || s === "capture" || s === "success" || s === "paid")
    return "bg-emerald-100 text-emerald-800 border-emerald-200/80";
  if (s === "pending" || s === "challenge")
    return "bg-amber-100 text-amber-900 border-amber-200/80";
  if (
    s === "cancel" ||
    s === "deny" ||
    s === "expire" ||
    s === "failure" ||
    s === "cancelled"
  )
    return "bg-red-100 text-red-800 border-red-200/80";
  if (s) return "bg-slate-100 text-slate-800 border-slate-200/80";
  return "bg-slate-100 text-slate-600 border-slate-200/80";
}

function statusLabelId(status: string | null | undefined): string {
  const s = (status ?? "").toLowerCase();
  const map: Record<string, string> = {
    settlement: "Berhasil (settlement)",
    capture: "Berhasil (capture)",
    pending: "Menunggu",
    challenge: "Verifikasi",
    deny: "Ditolak",
    cancel: "Dibatalkan",
    expire: "Kedaluwarsa",
    failure: "Gagal",
  };
  if (!s) return "—";
  return map[s] ?? s;
}

/**
 * Contoh: /transactions?order_id=TSACT-56B05769&status_code=200&transaction_status=settlement
 * Detail: GET /api/ticketing/transactions/{order_id}
 */
export default function TransactionsClient() {
  const search = useSearchParams();
  const orderId = search.get("order_id")?.trim() ?? "";
  const statusCode = search.get("status_code");
  const transactionStatus = search.get("transaction_status");

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [row, setRow] = useState<TransactionRow | null>(null);

  useEffect(() => {
    if (!orderId) return;
    setError(null);
    setRow(null);
    setLoading(true);
    const path = encodeURIComponent(orderId);
    void fetch(`/api/ticketing/transactions/${path}`, { cache: "no-store" })
      .then(async (res) => {
        const text = await res.text();
        let json: unknown;
        try {
          json = text ? (JSON.parse(text) as unknown) : null;
        } catch {
          setError("Respons tidak valid");
          return;
        }
        if (!res.ok) {
          const msg = pickErrorMessage(json, res.status);
          setError(msg);
          return;
        }
        const env = json as ApiEnvelope;
        const { row: extracted, message } = extractTransactionRow(env);
        if (extracted) {
          setRow(extracted);
        } else {
          setError(
            message?.trim() ||
              "Data transaksi tidak ditemukan dalam respons.",
          );
        }
      })
      .catch((e) => {
        setError(e instanceof Error ? e.message : "Gagal memuat");
      })
      .finally(() => setLoading(false));
  }, [orderId]);

  const displayStatus = row?.status ?? transactionStatus;
  const refNo = row?.tsact_doc?.trim() || orderId;

  if (!orderId) {
    return (
      <main className={MAIN_WITH_NAV_OFFSET}>
        <div className="mx-auto max-w-lg px-4 py-8 sm:px-6 sm:py-10">
          <h1 className="text-2xl font-bold text-[#1A2A44] sm:text-3xl">
            Transaksi
          </h1>
          <p className="mt-2 text-slate-600 text-sm leading-relaxed">
            Tambahkan <code className="rounded bg-white/80 px-1.5 py-0.5 text-xs">order_id=…</code>{" "}
            di URL.
          </p>
          <p className="mt-3 text-slate-500 text-xs break-all">
            Contoh:{" "}
            <span className="font-mono">
              /transactions?order_id=TSACT-56B05769&status_code=200&transaction_status=settlement
            </span>
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className={MAIN_WITH_NAV_OFFSET}>
      <div className="mx-auto max-w-lg px-4 py-6 sm:px-6 sm:py-8">
        <h1 className="text-2xl font-bold text-[#1A2A44] sm:text-3xl">
          Detail transaksi
        </h1>

        {loading ? (
          <div
            className="mt-10 flex flex-col items-center justify-center gap-3 py-12 text-slate-600"
            role="status"
            aria-live="polite"
          >
            <Loader2 className="h-8 w-8 shrink-0 animate-spin text-[#00AEEF]" />
            <span className="text-sm">Memuat detail transaksi…</span>
          </div>
        ) : error ? (
          <div
            className="mt-6 flex gap-3 rounded-2xl border border-red-100 bg-red-50/90 px-4 py-3 text-sm text-red-800"
            role="alert"
          >
            <AlertCircle className="h-5 w-5 shrink-0" aria-hidden />
            <p>{error}</p>
          </div>
        ) : row ? (
          <div className="mt-6 space-y-4">
            <div className="rounded-2xl border-4 border-white bg-white/90 p-4 shadow-sm sm:p-5">
              <p className="text-slate-500 text-xs">Nomor transaksi</p>
              <p className="mt-0.5 font-mono text-sm font-semibold break-all text-[#1A2A44]">
                {refNo}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${statusBadgeClass(displayStatus)}`}
              >
                {["settlement", "capture", "success", "paid"].includes(
                  (displayStatus ?? "").toLowerCase(),
                ) && <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />}
                {statusLabelId(displayStatus)}
              </span>
              {(statusCode != null || transactionStatus != null) && (
                <span className="text-slate-500 text-xs">
                  {statusCode != null && (
                    <span>Midtrans: {statusCode} · </span>
                  )}
                  {transactionStatus != null && (
                    <span>{transactionStatus}</span>
                  )}
                </span>
              )}
            </div>

            <section
              className="rounded-2xl border-4 border-white bg-white/90 p-4 shadow-sm sm:p-5"
              aria-label="Pembeli"
            >
              <h2 className="mb-3 flex items-center gap-2 font-semibold text-[#1A2A44] text-sm sm:text-base">
                <User className="h-4 w-4 text-[#E5007E]" aria-hidden />
                Pembeli
              </h2>
              <dl className="space-y-2.5 text-sm">
                <div>
                  <dt className="text-slate-500 text-xs">Nama</dt>
                  <dd className="font-medium text-[#1a1a2e]">
                    {row.cust_name?.trim() || "—"}
                  </dd>
                </div>
                {row.email ? (
                  <div>
                    <dt className="text-slate-500 text-xs">Email</dt>
                    <dd className="break-all font-medium text-[#1a1a2e]">
                      {row.email}
                    </dd>
                  </div>
                ) : null}
                <div>
                  <dt className="flex items-center gap-1.5 text-slate-500 text-xs">
                    <Phone className="h-3 w-3" aria-hidden />
                    Telepon
                  </dt>
                  <dd>
                    {row.phone_number ? (
                      <a
                        href={`tel:${row.phone_number.replace(/\s/g, "")}`}
                        className="font-medium text-[#00AEEF] active:opacity-80"
                      >
                        {row.phone_number}
                      </a>
                    ) : (
                      "—"
                    )}
                  </dd>
                </div>
              </dl>
            </section>

            <section
              className="rounded-2xl border-4 border-white bg-white/90 p-4 shadow-sm sm:p-5"
              aria-label="Tiket & kunjungan"
            >
              <h2 className="mb-3 flex items-center gap-2 font-semibold text-[#1A2A44] text-sm sm:text-base">
                <Ticket className="h-4 w-4 text-[#00AEEF]" aria-hidden />
                Tiket & kunjungan
              </h2>
              <dl className="space-y-2.5 text-sm">
                <div>
                  <dt className="text-slate-500 text-xs">SKU</dt>
                  <dd className="flex items-center gap-1.5 font-mono font-medium text-[#1a1a2e]">
                    <Package className="h-3.5 w-3.5 text-slate-400" aria-hidden />
                    {row.sku?.trim() || "—"}
                  </dd>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <dt className="text-slate-500 text-xs">Dewasa</dt>
                    <dd className="font-semibold text-lg tabular-nums">
                      {row.qty_adult ?? 0}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-slate-500 text-xs">Anak</dt>
                    <dd className="font-semibold text-lg tabular-nums">
                      {row.qty_child ?? 0}
                    </dd>
                  </div>
                </div>
                <div>
                  <dt className="flex items-center gap-1.5 text-slate-500 text-xs">
                    <Calendar className="h-3 w-3" aria-hidden />
                    Tanggal kunjungan
                  </dt>
                  <dd className="mt-0.5 font-medium text-[#1a1a2e] leading-snug">
                    {formatIdDateOnly(row.visit_date ?? undefined)}
                  </dd>
                </div>
                {row.notes ? (
                  <div>
                    <dt className="text-slate-500 text-xs">Catatan</dt>
                    <dd className="whitespace-pre-wrap text-[#1a1a2e]">
                      {row.notes}
                    </dd>
                  </div>
                ) : null}
              </dl>
            </section>

            <section
              className="rounded-2xl border-4 border-white bg-gradient-to-br from-amber-50/90 to-white p-4 shadow-sm sm:p-5"
              aria-label="Pembayaran"
            >
              <h2 className="mb-2 flex items-center gap-2 font-semibold text-[#1A2A44] text-sm sm:text-base">
                <CreditCard className="h-4 w-4 text-amber-600" aria-hidden />
                Total pembayaran
              </h2>
              <p className="text-2xl font-bold tabular-nums text-[#1A2A44] sm:text-3xl">
                Rp {formatIdrRupiah(row.total_payment)}
              </p>
            </section>

            {row.creation_date ? (
              <p className="px-0.5 text-slate-500 text-xs sm:text-sm">
                Dibuat: {formatIdDateTime(row.creation_date)}
              </p>
            ) : null}
          </div>
        ) : null}
      </div>
    </main>
  );
}

function pickErrorMessage(json: unknown, status: number): string {
  if (isRecord(json) && typeof json.error === "string" && json.error)
    return json.error;
  if (isRecord(json) && typeof json.message === "string" && json.message)
    return json.message;
  return `Gagal memuat (${status})`;
}
