import type { Metadata } from "next";
import { Fredoka } from "next/font/google";
import "./globals.css";

const fredoka = Fredoka({
  variable: "--font-fredoka-var",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Pikuland — Dunia Imajinasi Si Kecil Dimulai di Sini!",
  description:
    "Pikuland adalah taman bermain peran edukatif pertama di Indonesia untuk anak usia 2–14 tahun. Beli tiket sekarang dan rasakan petualangan tanpa batas!",
  keywords: ["pikuland", "taman bermain anak", "playground", "edukatif", "Jakarta"],
  openGraph: {
    title: "Pikuland — Dunia Imajinasi Si Kecil",
    description: "Taman bermain peran edukatif pertama di Indonesia untuk anak usia 2–14 tahun.",
    type: "website",
    locale: "id_ID",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${fredoka.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
