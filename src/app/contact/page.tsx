import KontakPageClient from "@/components/KontakPageClient";
import { fetchContactContent } from "@/services/content/contact";

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const contactContent = await fetchContactContent();

  return <KontakPageClient content={contactContent} />;
}
