import type {
  CareerContent,
  CareerJobCardLabels,
} from "@/types/careerContent";

/** Default job-card labels; CMS values override these when present. */
export const CAREER_JOB_CARD_LABELS_FALLBACK: CareerJobCardLabels = {
  location: "Lokasi:",
  qualifications: "Kualifikasi:",
  sendCv: "Kirim CV kamu ke :",
  dueDatePrefix: "*Lowongan Berakhir",
};

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
  jobCard: CAREER_JOB_CARD_LABELS_FALLBACK,
};
