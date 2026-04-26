import { callCheckoutUpstream } from "@/services/ticketing/callTicketingProductsUpstream";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const bodyText = await request.text();
  const upstreamBody = bodyText.trim() || "{}";
  const { status, body } = await callCheckoutUpstream(upstreamBody);
  return new NextResponse(body, {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}
