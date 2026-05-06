import TiketPageClient from "@/components/TiketPageClient";
import { fetchTicketContent } from "@/services/content/ticket";
import { loadTicketingProductsForPage } from "@/services/ticketing/loadTicketingProductsForPage";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const content = await fetchTicketContent();
  const { metaTitle, metaDescription } = content.seo;
  return {
    title: metaTitle,
    description: metaDescription,
    openGraph: {
      title: metaTitle,
      description: metaDescription,
    },
  };
}

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
