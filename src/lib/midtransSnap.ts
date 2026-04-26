declare global {
  interface Window {
    snap?: {
      pay: (
        token: string,
        options?: {
          onSuccess?: (result: unknown) => void;
          onPending?: (result: unknown) => void;
          onError?: (result: unknown) => void;
          onClose?: () => void;
        },
      ) => void;
    };
  }
}

const SCRIPT_ID_PREFIX = "midtrans-snap-js";

/** Resmi; beberapa build demo memakai `/snap/assets/snap.js` — kita coba keduanya di sandbox. */
const SANDBOX_SNAP_URLS = [
  "https://app.sandbox.midtrans.com/snap/snap.js",
  "https://app.sandbox.midtrans.com/snap/assets/snap.js",
] as const;
const PRODUCTION_SNAP_URL = "https://app.midtrans.com/snap/snap.js";

function snapScriptUrls(): readonly string[] {
  const isProd = process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === "true";
  return isProd ? [PRODUCTION_SNAP_URL] : [...SANDBOX_SNAP_URLS];
}

/** Midtrans kadang mengekspos `window.snap` sedikit setelah `onload`. */
async function waitForSnapPay(maxMs = 10000): Promise<void> {
  const t0 = Date.now();
  while (Date.now() - t0 < maxMs) {
    if (typeof window.snap?.pay === "function") return;
    await new Promise((r) => setTimeout(r, 50));
  }
  throw new Error("Snap tidak tersedia setelah script selesai dimuat");
}

/**
 * Loads Midtrans Snap. Requires:
 * - `NEXT_PUBLIC_MIDTRANS_CLIENT_KEY`
 * - `NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION` = `"true"` for production
 */
export async function loadMidtransSnapScript(): Promise<void> {
  if (typeof window === "undefined") return;
  if (typeof window.snap?.pay === "function") return;

  const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY?.trim();
  if (!clientKey) {
    throw new Error("NEXT_PUBLIC_MIDTRANS_CLIENT_KEY belum diset");
  }

  const urls = snapScriptUrls();
  let lastError: Error | null = null;

  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    const id = `${SCRIPT_ID_PREFIX}-try${i}`;

    const existing = document.getElementById(id) as HTMLScriptElement | null;
    existing?.remove();

    try {
      await new Promise<void>((resolve, reject) => {
        const s = document.createElement("script");
        s.id = id;
        s.type = "text/javascript";
        s.async = true;
        s.src = url;
        s.setAttribute("data-client-key", clientKey);
        s.onload = () => resolve();
        s.onerror = () => reject(new Error(`Gagal memuat ${url}`));
        document.body.appendChild(s);
      });
      await waitForSnapPay();
      return;
    } catch (e) {
      lastError = e instanceof Error ? e : new Error(String(e));
      document.getElementById(id)?.remove();
    }
  }

  throw lastError ?? new Error("Gagal memuat Midtrans Snap");
}

const noop = (): void => undefined;
const noopResult = (_result: unknown): void => undefined;

/**
 * Membuka Snap. Midtrans mewajibkan callback (terutama `onSuccess`) bertipe `function`, bukan `undefined`.
 * Client key tetap hanya lewat atribut `data-client-key` pada tag script (env `NEXT_PUBLIC_MIDTRANS_CLIENT_KEY`).
 */
export function openSnapPayment(
  token: string,
  options?: {
    onSuccess?: (result: unknown) => void;
    onPending?: (result: unknown) => void;
    onError?: (result: unknown) => void;
    onClose?: () => void;
  },
): void {
  if (!token) {
    throw new Error("Snap token kosong");
  }
  if (typeof window.snap?.pay !== "function") {
    throw new Error("Snap belum dimuat");
  }
  window.snap.pay(token, {
    onSuccess: options?.onSuccess ?? noopResult,
    onPending: options?.onPending ?? noopResult,
    onError: options?.onError ?? noopResult,
    onClose: options?.onClose ?? noop,
  });
}
