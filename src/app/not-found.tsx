import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 bg-cream text-center px-6">
      {/* Decorative element */}
      <Image
        src="/assets/vector-12.png"
        alt=""
        width={120}
        height={120}
        className="animate-float"
      />
      <h1 className="text-6xl md:text-8xl font-black text-pink">404</h1>
      <p className="text-xl md:text-2xl font-bold text-blue-dark">
        Oops! Halaman tidak ditemukan
      </p>
      <p className="text-gray-500 max-w-md">
        Petualangan ini belum tersedia. Yuk kembali ke halaman utama dan
        jelajahi Pikuland!
      </p>
      <Link
        href="/"
        className="mt-4 inline-block bg-pink text-white font-bold px-8 py-4 rounded-full text-lg hover:scale-105 transition-transform shadow-lg"
      >
        Kembali ke Beranda
      </Link>
    </main>
  );
}
