import type { CareerContent } from "@/types/careerContent";

/** Used when career CMS fetch fails or returns incomplete data. */
export const CAREER_PAGE_FALLBACK: CareerContent = {
  preTitle: "JOIN OUR TEAM",
  title: "Bekerja Sambil Bermain!",
  description:
    "<p>Pikuland bukan sekadar tempat kerja, tapi rumah kedua di mana kita menciptakan senyum anak-anak setiap hari. Lingkungan kerja suportif, seru, dan penuh tawa menantimu!</p>",
  openPositionLabel: "Posisi Tersedia",
  values: [
    {
      title: "Fun Environment",
      description:
        "Kerja rasa main, bebas stres, dan penuh kreativitas.",
    },
    {
      title: "Health & Bonus",
      description:
        "BPJS, tunjangan kesehatan, dan bonus performa menarik.",
    },
    {
      title: "Training",
      description:
        "Pelatihan soft skill dan pengembangan karir berkala.",
    },
  ],
};
