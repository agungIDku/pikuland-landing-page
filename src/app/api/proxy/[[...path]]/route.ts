import { NextRequest, NextResponse } from "next/server";

const BACKEND_BASE = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");
const PROXY_MAX_RETRIES = 3;
const PROXY_RETRY_DELAY_MS = 400;

function isRetryableError(err: unknown): boolean {
  const code =
    err && typeof err === "object" && "cause" in err
      ? (err as { cause?: { code?: string } }).cause?.code
      : (err as { code?: string })?.code;
  return (
    code === "ECONNRESET" ||
    code === "ETIMEDOUT" ||
    code === "ECONNREFUSED" ||
    code === "EPIPE" ||
    code === "UND_ERR_CONNECT_TIMEOUT"
  );
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path?: string[] }> },
) {
  return proxy(request, context, "GET");
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ path?: string[] }> },
) {
  return proxy(request, context, "POST");
}

async function proxy(
  request: NextRequest,
  context: { params: Promise<{ path?: string[] }> },
  method: "GET" | "POST",
) {
  const { path } = await context.params;
  if (!path?.length) {
    return NextResponse.json({ error: "Missing path" }, { status: 400 });
  }

  const backendPath = path.join("/");
  const search = request.nextUrl.searchParams.toString();
  const url = search
    ? `${BACKEND_BASE}/${backendPath}?${search}`
    : `${BACKEND_BASE}/${backendPath}`;

  const headers = new Headers();
  request.headers.forEach((value, key) => {
    const lower = key.toLowerCase();
    if (
      lower === "accept-language" ||
      lower === "content-type" ||
      lower === "accept"
    ) {
      headers.set(key, value);
    }
  });

  let bodyText: string | undefined;
  if (method === "POST" && request.body) {
    bodyText = await request.text();
  }

  const init: RequestInit = {
    method,
    headers,
    cache: "no-store",
    ...(bodyText !== undefined && { body: bodyText }),
  };

  let lastError: unknown;
  for (let attempt = 1; attempt <= PROXY_MAX_RETRIES; attempt++) {
    try {
      const res = await fetch(url, init);
      const body = await res.text();
      const resHeaders = new Headers();
      const skipHeaders = ["transfer-encoding", "content-encoding"];
      res.headers.forEach((value, key) => {
        if (!skipHeaders.includes(key.toLowerCase())) {
          resHeaders.set(key, value);
        }
      });
      return new NextResponse(body, {
        status: res.status,
        statusText: res.statusText,
        headers: resHeaders,
      });
    } catch (err) {
      lastError = err;
      if (attempt < PROXY_MAX_RETRIES && isRetryableError(err)) {
        await new Promise((r) => setTimeout(r, PROXY_RETRY_DELAY_MS));
      } else {
        break;
      }
    }
  }

  console.error("[proxy]", url, lastError);
  return NextResponse.json(
    { error: "Proxy request failed" },
    { status: 502 },
  );
}
