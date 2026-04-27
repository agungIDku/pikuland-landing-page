import { callTransactionDetailUpstream } from "@/services/ticketing/callTicketingProductsUpstream";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  if (!id?.trim()) {
    return NextResponse.json(
      { error: "Missing transaction id" },
      { status: 400 },
    );
  }
  const { status, body } = await callTransactionDetailUpstream(id.trim());
  return new NextResponse(body, {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}
