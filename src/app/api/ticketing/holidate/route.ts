import { callHolidateUpstream } from "@/services/ticketing/callTicketingProductsUpstream";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const bodyText = await request.text();
  const upstreamBody = bodyText.trim() || "{}";
  const { status, body } = await callHolidateUpstream(upstreamBody);
  const contentType = "application/json; charset=utf-8";

  return new NextResponse(body, {
    status,
    headers: { "Content-Type": contentType },
  });
}
