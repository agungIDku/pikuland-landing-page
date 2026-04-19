import type { Metadata } from "next";
import { Fredoka } from "next/font/google";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { fetchFooterContent } from "@/services/content/footer";
import { fetchMenuContent } from "@/services/content/menu";
import "./globals.css";

const fredoka = Fredoka({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Pikuland — Dunia Imajinasi Si Kecil Dimulai di Sini!",
  description:
    "Pikuland adalah taman bermain peran edukatif pertama di Indonesia untuk anak usia 2–14 tahun. Beli tiket sekarang dan rasakan petualangan tanpa batas!",
  keywords: [
    "pikuland",
    "taman bermain anak",
    "playground",
    "edukatif",
    "Jakarta",
  ],
  openGraph: {
    title: "Pikuland — Dunia Imajinasi Si Kecil",
    description:
      "Taman bermain peran edukatif pertama di Indonesia untuk anak usia 2–14 tahun.",
    type: "website",
    locale: "id_ID",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [menuPage, footerContent] = await Promise.all([
    fetchMenuContent(),
    fetchFooterContent(),
  ]);

  return (
    <html lang="id">
      <body className={`${fredoka.variable} antialiased`}>
        <Navbar
          menu={menuPage?.menu}
          navCta={menuPage?.navCta}
          logoUrl={menuPage?.logoUrl}
        />
        {children}
        {footerContent ? <Footer content={footerContent} /> : null}
      </body>
    </html>
  );
}
