import GaleriPageClient from "@/components/GaleriPageClient";
import { fetchGalleryPageAssets } from "@/services/content/galleries";
import { fetchGalleryContent } from "@/services/content/gallery";

export const dynamic = "force-dynamic";

export default async function GaleriPage() {
  const [galleryContent, assets] = await Promise.all([
    fetchGalleryContent(),
    fetchGalleryPageAssets(),
  ]);

  return (
    <GaleriPageClient
      initialContent={galleryContent}
      categoryTabs={assets.categoryTabs}
      galleryItems={assets.galleryItems}
    />
  );
}
