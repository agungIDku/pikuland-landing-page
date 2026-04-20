import KarirPageClient from "@/components/KarirPageClient";
import { fetchCareerContent } from "@/services/content/career";
import { fetchCareersList } from "@/services/content/careers";

export const dynamic = "force-dynamic";

export default async function KarirPage() {
  const [careerContent, careerJobs] = await Promise.all([
    fetchCareerContent(),
    fetchCareersList(),
  ]);

  return (
    <KarirPageClient content={careerContent} jobs={careerJobs} />
  );
}
