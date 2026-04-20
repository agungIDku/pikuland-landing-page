import type { TicketContent } from "@/types/ticketContent";

/** Used when API fails or fields are missing after merge. */
export const TICKET_PAGE_FALLBACK: TicketContent = {
  title: "Pilih Tiket Petualanganmu!",
  description:
    "<p>Main sepuasnya, belajar sebanyaknya. Pilih paket yang paling pas untuk keluarga.</p>",
  cheapestPriceLabel: "Paling Hemat",
  chooseTicketLabel: "Pilih Tiket",
  fnq: {
    title: "Pertanyaan Sering Diajukan",
    items: [
      {
        question: "Apakah boleh bawa makanan dari luar?",
        answer:
          "Demi kebersihan dan keamanan, makanan dan minuman dari luar tidak diperkenankan. Kami menyediakan food court dengan menu ramah anak.",
      },
      {
        question: "Apakah tiket bisa di-refund?",
        answer:
          "Tiket yang sudah dibeli tidak dapat di-refund, namun dapat dilakukan reschedule maksimal H-1 kunjungan.",
      },
      {
        question: "Apakah pendamping wajib bayar?",
        answer:
          "Satu tiket anak sudah termasuk satu orang pendamping dewasa secara gratis.",
      },
    ],
  },
  steps: {
    step1Label: "Pilih Tiket",
    step2Label: "Pilih Tanggal",
    step3Label: "Bayar",
  },
  ticketCheckoutPage: {
    title: "Kapan Mau Main?",
    description:
      "<p>Pilih tanggal kunjungan dan jumlah petualang kecil yang akan bermain.</p>",
    form: {
      chooseDateLabel: "Pilih Tanggal",
      dateInformation:
        "<p>Tiket berlaku hanya untuk tanggal yang dipilih. Reschedule maksimal H-1.</p>",
      totalVisitorsLabel: "Jumlah Pengunjung",
      children: {
        label: "Anak-anak",
        detailInfo: "Usia 1 - 12 Tahun",
      },
      adult: {
        label: "Dewasa",
        detailInfo: "Usia 17+ Tahun",
      },
      buttonBackLabel: "Kembali",
      buttonSubmitLabel: "Lanjut Pembayaran",
      ticketInformation: "",
    },
  },
};
