import KarirPageClient from "@/components/KarirPageClient";
import { fetchCareerContent } from "@/services/content/career";

export const dynamic = "force-dynamic";

export default async function KarirPage() {
  const careerContent = await fetchCareerContent();

  console.log(careerContent);

  return <KarirPageClient content={careerContent} />;
}
