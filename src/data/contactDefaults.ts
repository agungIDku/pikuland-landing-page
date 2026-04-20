import type { ContactContent } from "@/types/contactContent";

export const CONTACT_PAGE_FALLBACK: ContactContent = {
  title: "Halo, Ada yang Bisa Dibantu?",
  description:
    "<p>Jangan ragu untuk bertanya, tim kami yang ramah siap membantu Ayah &amp; Bunda!</p>",
  form: {
    title: "Kirim Pesan",
    parentsNameLabel: "Nama Ayah/Bunda",
    parentsNamePlaceholder: "Contoh: Budi Santoso",
    emailLabel: "Email",
    messageLabel: "Pesan",
    messagePlaceholder: "Tulis pertanyaan atau saran di sini...",
    submitButtonLabel: "Kirim Pesan",
  },
  location: {
    title: "Lokasi Pikuland",
    address:
      "<p>Mall Grand Pikuland, Lantai 3</p><p>Jl. Boulevard Raya No. 1, Kelapa Gading</p><p>Jakarta Utara, 14240</p>",
    mapsUrl: "",
  },
};
