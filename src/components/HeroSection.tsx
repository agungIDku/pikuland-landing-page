"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function HeroSection() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <section className="relative overflow-hidden">
      {/* === TOP WRAPPER: Membungkus background dan wave sehingga foto background terpotong tepat pada Wave bounding box === */}
      <div className="relative w-full min-h-screen md:min-h-0 overflow-hidden flex flex-col">
        {/* ===== Hero Background ===== */}
        <div className="absolute inset-0 z-0 bg-[#E1F5FE] pointer-events-none">
          <Image
          src={isMobile ? "/assets/petualangan-tak-terbatas.png" : "/assets/hero-background.png"}
          alt="Pikuland playground background"
          fill
          sizes="100vw"
          className="object-cover object-top brightness-60"
          priority
          quality={100}
        />
        {/* Subtle overlay */}
        <div className="absolute inset-0 bg-white/10" />
      </div>

      {/* ===== Hero Content ===== */}
      {/* Konten teks pahlawan dipisahkan dari video agar wave dapat diselipkan di tengah */}
      <div className="relative z-20 flex flex-col items-center text-center pt-44 sm:pt-32 md:pt-40 lg:pt-48 px-4 flex-1 md:flex-none">
        {/* H1 — Playful Typography */}
        <h1 className="text-5xl sm:text-6xl lg:text-5xl xl:text-6xl font-black text-white leading-tight md:leading-[1.1] max-w-3xl drop-shadow-md text-center mx-auto">
          Dunia Imajinasi <br className="hidden" />
          <span className="text-[#FFCB05]">Si Kecil</span> Dimulai di Sini!
        </h1>

        {/* CTA Button */}
        <div className="mt-5 md:mt-6 relative z-30">
          <Link
            href="/tiket"
            className="inline-flex items-center gap-2 bg-[#E5007E] text-white font-bold text-sm px-6 py-4 rounded-full hover:bg-[#E5007E]/90 transition-all shadow-md border-[1px] border-white shrink-0"
          >
            Beli Tiket Sekarang
            <Image
              src="/assets/icon-3.png"
              alt="Sparkle Icon"
              width={20}
              height={20}
              className="w-4 h-4 md:w-5 md:h-5 object-contain"
            />
          </Link>
        </div>
      </div>

      {/* ===== Wave Container Image ===== */}
      <div className="relative z-10 w-full pointer-events-none mt-auto md:mt-8 flex flex-col justify-end">
        <Image 
          src="/assets/wave.png" 
          alt="Wave Border" 
          width={1440} 
          height={150} 
          className="w-full h-auto object-cover" 
          priority 
        />
      </div>
      
      </div> {/* <-- END OF TOP WRAPPER */}

      {/* ===== Video / Gameplay Preview Container ===== */}
      {/* Kontainer ditarik naik (negative margin) menimpa gambar wave, sekaligus mengembalikan ornamen di sisi videonya */}
      <div className="relative -mt-10 sm:-mt-16 md:-mt-20 lg:-mt-24 w-full max-w-[650px] mx-auto z-20 px-4 mb-20 lg:mb-32">
        <div className="absolute inset-0 pointer-events-none z-0">
          {/* Decorative Vectors Hero */}
          {/* vector-1: kiri tengah — mobile: disembunyikan karena terlalu jauh */}
          <Image src="/assets/vector-1.png" alt="" width={80} height={40} className="absolute hidden sm:block top-[40%] -left-65" />
          {/* vector-15: kiri bawah — mobile: kecil di pojok kiri bawah */}
          <Image src="/assets/vector-15.png" alt="" width={100} height={100} className="absolute -bottom-2 -left-2 w-12 h-12 sm:w-[100px] sm:h-[100px] sm:-left-8" />
          {/* vector-11: kanan bawah — mobile: kecil di pojok kanan bawah */}
          <Image src="/assets/vector-11.png" alt="" width={80} height={80} className="absolute top-[60%] -right-4 w-10 h-10 sm:w-[80px] sm:h-[80px] sm:-right-15" />
          {/* vector-10: kanan tengah — mobile: disembunyikan karena terlalu jauh */}
          <Image src="/assets/vector-10.png" alt="" width={90} height={40} className="absolute hidden sm:block top-[40%] -right-12" />
        </div>

        <div className="relative border-[12px] md:border-[16px] border-white rounded-[1.5rem] md:rounded-[2rem] overflow-hidden shadow-xl bg-white aspect-video z-10">
            {/* Gameplay Preview Image */}
            <Image
              src="/assets/gameplay-preview.png"
              alt="Pikuland gameplay preview — lihat betapa serunya bermain di Pikuland"
              fill
              className="object-cover"
              priority
            />

            {/* Play Button Overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/20 hover:bg-black/20 cursor-pointer transition-colors">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-white/95 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                <svg
                  className="w-6 h-6 md:w-8 md:h-8 text-[#E5007E] ml-1 opacity-80"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Caption under video */}
          <div className="mt-4 md:mt-5 flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 bg-[#00A1E4] rounded-full"></span>
            <p className="text-[10px] md:text-xs text-[#6B7280] font-bold tracking-wide uppercase">
              See how kids explore and learn inside Pikuland
            </p>
            <span className="w-1.5 h-1.5 bg-[#00A1E4] rounded-full"></span>
          </div>
        </div>
    </section>
  );
}
