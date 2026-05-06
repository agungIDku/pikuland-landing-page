import type { TicketContent } from "@/types/ticketContent";

/** Used when API fails or fields are missing after merge (Indonesian). */
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
    step3Label: "Booking",
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
      buttonSubmitLabel: "Lanjut booking",
      ticketInformation: "",
    },
  },
  seo: {
    metaTitle: "Tiket | Pikuland",
    metaDescription:
      "Lihat pilihan tiket dan harga resmi Pikuland. Pesan tiket main per durasi yang Anda inginkan.",
  },
  step3Intro: {
    description:
      "<p>Periksa ringkasan pesanan, isi data kontak dan nama pengunjung anak, lalu kirim booking Anda.</p>",
  },
  productCards: {
    emptyMessage: "Belum ada tiket yang tersedia saat ini.",
    sellingPriceLabel: "Harga jual",
    productFallbackPrefix: "Tiket",
  },
  selectedTicket: {
    caption: "Tiket terpilih",
    loadingPriceHint: "Memuat harga tanggal pilihan…",
    priceAdjustedHint: "Harga disesuaikan untuk tanggal ini",
  },
  calendar: {
    prevMonthAria: "Bulan sebelumnya",
    nextMonthAria: "Bulan berikutnya",
    weekdays: {
      sun: "Min",
      mon: "Sen",
      tue: "Sel",
      wed: "Rab",
      thu: "Kam",
      fri: "Jum",
      sat: "Sab",
    },
    holidayTooltip: "Hari khusus — harga dapat berbeda",
    holidayLegend:
      "<p>Tanggal ber-tanda: hari khusus (bisa hari libur nasional atau <strong>tarif berbeda</strong>). Pilih tanggal untuk melanjutkan.</p>",
  },
  formMessages: {
    selectVisitDateFirst: "Pilih tanggal kunjungan terlebih dahulu.",
    waitForPriceLoad:
      "Tunggu sebentar hingga harga tanggal pilihan selesai dimuat.",
    minVisitorsOne: "Jumlah pengunjung minimal 1.",
    visitsLoadFailed: "Gagal memuat detail harga.",
    fillContactFields: "Lengkapi nama, email, dan nomor telepon.",
    validEmail: "Isi email yang valid.",
    phoneMinDigits: "Nomor telepon minimal 10 digit.",
    customerHistoryFailed: "Gagal memuat riwayat pelanggan.",
    fillEachChildName: "Isi nama lengkap untuk setiap pengunjung anak.",
    invalidTotal: "Total tidak valid.",
    skuMissing: "SKU / artikel tidak tersedia.",
    bookingNoReference:
      "Booking tercatat, tetapi nomor referensi tidak dikembalikan. Hubungi admin jika perlu.",
    checkoutFailed: "Checkout gagal. Coba lagi.",
  },
  bookingReview: {
    datePrefix: "Tanggal:",
    visitorsPrefix: "Pengunjung:",
    childWord: "anak",
    adultWord: "dewasa",
  },
  bookingContactForm: {
    fullNameLabel: "Nama lengkap",
    fullNamePlaceholder: "Nama sesuai KTP / kartu",
    emailLabel: "Email",
    emailPlaceholder: "nama@email.com",
    phoneLabel: "No. telepon",
    phonePlaceholder: "08...",
    phoneHelpText:
      "Tekan Selanjutnya untuk memuat riwayat nama anak (jika ada) dan menampilkan form nama pengunjung anak.",
    contactSectionTitle: "Data kontak",
    childSectionTitle: "Nama pengunjung anak",
    childNamesHint:
      "Nama terisi otomatis dari riwayat sesuai urutan array di server (maks. sesuai jumlah tiket anak). Boleh diubah manual.",
    childNameLabelPrefix: "Nama anak",
    childNamePlaceholderPrefix: "Nama anak",
    noChildTicketsMessage:
      "Tidak ada tiket anak pada pesanan ini. Lanjutkan dengan Booking.",
  },
  bookingActions: {
    back: "Kembali",
    next: "Selanjutnya",
    nextLoading: "Memuat…",
    submit: "Booking",
    submitLoading: "Memproses…",
  },
};
