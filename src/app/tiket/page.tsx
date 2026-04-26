import TiketPageClient from "@/components/TiketPageClient";
import { fetchTicketContent } from "@/services/content/ticket";
import { loadTicketingProductsForPage } from "@/services/ticketing/loadTicketingProductsForPage";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Tiket | Pikuland",
  description:
    "Lihat pilihan tiket dan harga resmi Pikuland. Pesan tiket main per durasi yang Anda inginkan.",
  openGraph: {
    title: "Tiket | Pikuland",
    description:
      "Lihat pilihan tiket dan harga resmi Pikuland. Pesan tiket main per durasi yang Anda inginkan.",
  },
};

export default async function TiketPage() {
  const [ticketContent, { products, error: productsError }] = await Promise.all(
    [fetchTicketContent(), loadTicketingProductsForPage()],
  );

  return (
    <TiketPageClient
      content={ticketContent}
      products={products}
      productsError={productsError}
    />
  );
}
