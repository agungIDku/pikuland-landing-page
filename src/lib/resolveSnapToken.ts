/**
 * Midtrans / backend dapat mengembalikan token Snap di key yang berbeda.
 */
export function resolveSnapTokenFromCheckoutData(
  data: unknown,
): string | null {
  if (!data || typeof data !== "object") return null;
  const o = data as Record<string, unknown>;
  const keys = [
    "midtrans_token",
    "snap_token",
    "token",
    "transaction_token",
    "snapToken",
    "midtransToken",
  ] as const;
  for (const k of keys) {
    const v = o[k];
    if (typeof v === "string" && v.trim().length > 0) {
      return v.trim();
    }
  }
  return null;
}
