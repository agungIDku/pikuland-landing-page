import { callVisitsUpstream } from "@/services/ticketing/callTicketingProductsUpstream";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const bodyText = await request.text();
  const upstreamBody = bodyText.trim() || "{}";
  const { status, body } = await callVisitsUpstream(upstreamBody);
  return new NextResponse(body, {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}
