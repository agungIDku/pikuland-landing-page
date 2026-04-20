import { z } from "zod";

const validationMessages = {
  en: {
    nameRequired: "Name is required.",
    nameTooLong: "Name is too long.",
    emailRequired: "Email is required.",
    emailInvalid: "Invalid email format.",
    messageMin: "Message must be at least 10 characters.",
    messageMax: "Message is too long.",
  },
  id: {
    nameRequired: "Nama wajib diisi.",
    nameTooLong: "Nama terlalu panjang.",
    emailRequired: "Email wajib diisi.",
    emailInvalid: "Format email tidak valid.",
    messageMin: "Pesan minimal 10 karakter.",
    messageMax: "Pesan terlalu panjang.",
  },
} as const;

export function createContactFormSchema(lang: "en" | "id") {
  const m = validationMessages[lang];
  return z.object({
    name: z
      .string()
      .trim()
      .min(1, m.nameRequired)
      .max(200, m.nameTooLong),
    email: z
      .string()
      .trim()
      .min(1, m.emailRequired)
      .email(m.emailInvalid),
    message: z
      .string()
      .trim()
      .min(10, m.messageMin)
      .max(8000, m.messageMax),
  });
}

export type ContactFormValues = z.infer<
  ReturnType<typeof createContactFormSchema>
>;

/** Alerts + submit loading — one language at a time via {@link useLangCookie}. */
export const contactFormUiCopy = {
  en: {
    successLabel: "English",
    successMessage:
      "Your message has been sent successfully. We will get back to you soon.",
    errorLabel: "Error",
    errorMessage:
      "Something went wrong and your message could not be sent. Please try again in a moment.",
    submitting: "Sending…",
  },
  id: {
    successLabel: "Bahasa Indonesia",
    successMessage:
      "Pesan Anda telah berhasil dikirim. Kami akan segera menghubungi Anda.",
    errorLabel: "Kesalahan",
    errorMessage:
      "Terjadi kesalahan dan pesan Anda tidak terkirim. Silakan coba lagi beberapa saat.",
    submitting: "Mengirim…",
  },
} as const;
