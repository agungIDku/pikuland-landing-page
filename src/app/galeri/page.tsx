"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import { useState } from "react";

const images = [
  {
    id: 1,
    src: "/assets/petualangan-tak-terbatas.png",
    category: "Fisik",
    pos: "left-tall",
  },
  {
    id: 2,
    src: "/assets/kolam-bola-raksasa.png",
    category: "Bermain",
    pos: "mid-top",
  },
  {
    id: 3,
    src: "/assets/gameplay-preview.png",
    category: "Edukasi",
    pos: "mid-bottom",
  },
  {
    id: 4,
    src: "/assets/panjat-tebing-aman.png",
    category: "Fisik",
    pos: "right-tall",
  },
];

const categories = ["Semua", "Edukasi", "Fisik", "Kreativitas", "Event"];

export default function GaleriPage() {
  const [activeTab, setActiveTab] = useState("Semua");

  // const filteredImages =
  //   activeTab === "Semua"
  //     ? images
  //     : images.filter((img) => img.category === activeTab);
  return (
    <>
      <Navbar />
      <main className="relative min-h-screen bg-[#FFFBE6] pt-32 pb-24 overflow-hidden">
        {/* BACKGROUND UTAMA - TIDAK DIHAPUS */}
        <div className="absolute inset-0 pointer-events-none opacity-40 z-0">
          <Image
            src="/assets/lines-1.png"
            alt=""
            fill
            className="object-cover object-top"
          />
        </div>

        {/* VEKTOR DEKORASI DARI ASET ANDA */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-visible">
          <Image
            src="/assets/vector-16.png"
            alt=""
            width={180}
            height={180}
            className="absolute top-[20%] right-[3.5%]"
          />
          <Image
            src="/assets/vector-1.png"
            alt=""
            width={100}
            height={50}
            className="absolute top-[75%] left-[4%]"
          />
          <Image
            src="/assets/vector-11.png"
            alt=""
            width={100}
            height={50}
            className="absolute bottom-[-1%] right-[20%] rotate-90 transform scale-x-[-1]"
          />
          <Image
            src="/assets/vector-11.png"
            alt=""
            width={100}
            height={50}
            className="absolute bottom-[-1%] left-[20%] rotate-280"
          />
        </div>

        <section className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* HEADER */}
          <header className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#1A2E44] mb-4">
              Galeri Keseruan
            </h1>
            <p className="text-base md:text-lg text-slate-500 max-w-2xl mx-auto font-medium">
              Intip momen-momen bahagia teman-teman kecil kita di Pikuland!
            </p>
          </header>

          {/* FILTER TABS */}
          <div className="flex flex-wrap justify-center gap-3 mb-14">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`px-8 py-2.5 rounded-full font-bold text-sm transition-all shadow-sm ${
                  activeTab === cat
                    ? "bg-[#E5007E] text-white shadow-lg shadow-pink-200"
                    : "bg-white text-slate-400 border border-slate-100 hover:bg-slate-50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:h-[700px]">
            {/* Kolom Kiri: Foto Tinggi */}
            <div className="relative h-[500px] md:h-full overflow-hidden rounded-[2.5rem] shadow-xl">
              <Image
                src={images[0].src}
                alt="Petualangan"
                fill
                className="object-cover"
              />
            </div>

            {/* Kolom Tengah: Dua Foto Kecil Vertikal */}
            <div className="grid grid-rows-2 gap-5 h-[600px] md:h-full">
              <div className="relative overflow-hidden rounded-[2rem] shadow-xl">
                <Image
                  src={images[1].src}
                  alt="Kolam Bola"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="relative overflow-hidden rounded-[2rem] shadow-xl">
                <Image
                  src={images[2].src}
                  alt="Gameplay"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Kolom Kanan: Foto Tinggi */}
            <div className="relative h-[500px] md:h-full overflow-hidden rounded-[2.5rem] shadow-xl">
              <Image
                src={images[3].src}
                alt="Panjat Tebing"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
