import type { GalleryContent, GalleryImageItem } from "@/types/galleryContent";

export const GALLERY_DEFAULT_IMAGES: GalleryImageItem[] = [
  {
    src: "/assets/petualangan-tak-terbatas.png",
    alt: "Petualangan",
    category: "Fisik",
  },
  {
    src: "/assets/kolam-bola-raksasa.png",
    alt: "Kolam Bola",
    category: "Bermain",
  },
  {
    src: "/assets/gameplay-preview.png",
    alt: "Gameplay",
    category: "Edukasi",
  },
  {
    src: "/assets/panjat-tebing-aman.png",
    alt: "Panjat Tebing",
    category: "Fisik",
  },
];

export const GALLERY_DEFAULT_CATEGORIES: string[] = [
  "Semua",
  "Edukasi",
  "Fisik",
  "Kreativitas",
  "Event",
];

/** Fallback when fetch fails or route uses client-only defaults. */
export const GALLERY_PAGE_FALLBACK: GalleryContent = {
  title: "Galeri Keseruan",
  subtitle:
    "Intip momen-momen bahagia teman-teman kecil kita di Pikuland!",
  categories: [...GALLERY_DEFAULT_CATEGORIES],
  images: GALLERY_DEFAULT_IMAGES,
};
