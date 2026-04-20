import TiketPageClient from "@/components/TiketPageClient";
import { fetchTicketContent } from "@/services/content/ticket";

export const dynamic = "force-dynamic";

export default async function TiketPage() {
  const ticketContent = await fetchTicketContent();

  return <TiketPageClient content={ticketContent} />;
}
