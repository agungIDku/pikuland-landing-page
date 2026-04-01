"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import { useState } from "react";
import { MapPin, Send, MessageCircle, Phone, Mail } from "lucide-react";

export default function KontakPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Pesan Terkirim", formData);
  };

  return (
    <>
      <Navbar />
      <main className="relative min-h-screen bg-[#FFFDF0] pt-32 pb-24 overflow-hidden">
        {/* BACKGROUND VECTORS - Biarkan Sesuai Permintaan */}
        <div className="absolute inset-0 pointer-events-none opacity-30 z-0">
          <Image
            src="/assets/lines-1.png"
            alt=""
            fill
            className="object-cover object-top"
          />
        </div>

        <div className="absolute inset-0 pointer-events-none z-0 overflow-visible">
          <Image
            src="/assets/vector-15.png"
            alt=""
            width={180}
            height={180}
            className="absolute top-[18%] right-[9%]"
          />
          <Image
            src="/assets/vector-1.png"
            alt=""
            width={100}
            height={50}
            className="absolute top-[75%] left-[4%]"
          />
        </div>

        <section className="relative z-10 max-w-6xl mx-auto px-6">
          {/* HEADER */}
          <header className="mb-12 md:mb-16 text-center">
            <h1 className="text-3xl md:text-5xl font-black text-[#1A2E44] mb-4 leading-tight">
              Halo, Ada <br className="md:hidden" /> yang Bisa <br className="md:hidden" /> Dibantu?
            </h1>
            <p className="text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed">
              Jangan ragu untuk bertanya, tim kami yang ramah siap membantu Ayah & Bunda!
            </p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start max-w-5xl mx-auto">
            
            {/* KOLOM KIRI (LOKASI + KONTAK KHUSUS MOBILE) */}
            <div className="flex flex-col gap-6">
              {/* KARTU LOKASI - Warna BG Kuning di Mobile, Putih di Desktop */}
              <div className="bg-[#FFF9C4]/50 md:bg-white p-6 md:p-10 rounded-[2.5rem] md:rounded-[3rem] shadow-xl shadow-blue-900/5 border border-yellow-100/50 md:border-slate-50">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-[#FFC107] rounded-full flex items-center justify-center text-white">
                    <MapPin size={22} fill="currentColor" />
                  </div>
                  <h3 className="text-xl font-black text-[#1A2E44]">
                    Lokasi Pikuland
                  </h3>
                </div>

                <div className="relative w-full aspect-[4/3] rounded-[2rem] overflow-hidden mb-6 border border-slate-100">
                  <Image
                    src="/assets/map.png"
                    alt="Peta Lokasi"
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="space-y-1 text-slate-500 font-medium text-sm md:text-base">
                  <p className="text-[#1A2E44] font-black">
                    Mall Grand Pikuland, Lantai 3
                  </p>
                  <p>Jl. Boulevard Raya No. 1, Kelapa Gading</p>
                  <p>Jakarta Utara, 14240</p>
                </div>
              </div>

              {/* KONTAK ITEMS (HANYA MUNCUL DI MOBILE) */}
              <div className="flex flex-col gap-3 lg:hidden">
                {/* WhatsApp */}
                <div className="bg-white p-4 rounded-3xl flex items-center gap-4 shadow-sm border border-slate-50">
                  <div className="w-12 h-12 bg-[#25D366] rounded-2xl flex items-center justify-center text-white">
                    <MessageCircle size={24} fill="currentColor" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-[#1A2E44]">WhatsApp</p>
                    <p className="text-sm text-slate-500">0812-3456-7890</p>
                  </div>
                </div>

                {/* Telepon */}
                <div className="bg-white p-4 rounded-3xl flex items-center gap-4 shadow-sm border border-slate-50">
                  <div className="w-12 h-12 bg-[#039BE5] rounded-2xl flex items-center justify-center text-white">
                    <Phone size={24} fill="currentColor" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-[#1A2E44]">Telepon</p>
                    <p className="text-sm text-slate-500">(021) 555-0123</p>
                  </div>
                </div>

                {/* Email */}
                <div className="bg-white p-4 rounded-3xl flex items-center gap-4 shadow-sm border border-slate-50">
                  <div className="w-12 h-12 bg-[#E5007E] rounded-2xl flex items-center justify-center text-white">
                    <Mail size={24} fill="currentColor" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-[#1A2E44]">Email</p>
                    <p className="text-sm text-slate-500">halo@pikuland.com</p>
                  </div>
                </div>
              </div>
            </div>

            {/* KOLOM KANAN (FORMULIR) */}
            <div className="bg-[#F0F9FF] p-1.5 rounded-[3.5rem] shadow-xl shadow-blue-100/50 mt-4 lg:mt-0">
              <div className="bg-white p-8 md:p-10 rounded-[3rem] shadow-sm">
                <h3 className="text-2xl font-black text-[#1A2E44] mb-8">
                  Kirim Pesan
                </h3>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-black text-[#1A2E44] mb-2 px-1">
                      Nama Ayah/Bunda
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: Budi Santoso"
                      className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-[#E5007E] focus:outline-none transition-all text-slate-600"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-black text-[#1A2E44] mb-2 px-1">
                      Email
                    </label>
                    <input
                      type="email"
                      placeholder="email@contoh.com"
                      className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-[#E5007E] focus:outline-none transition-all text-slate-600"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-black text-[#1A2E44] mb-2 px-1">
                      Pesan
                    </label>
                    <textarea
                      placeholder="Tulis pertanyaan atau saran di sini..."
                      rows={4}
                      className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-[#E5007E] focus:outline-none resize-none text-slate-600"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#E5007E] text-white py-4 rounded-full font-black text-lg flex items-center justify-center gap-3 hover:brightness-110 transition-all shadow-lg shadow-pink-200"
                  >
                    <Send size={20} className="rotate-[-10deg]" /> Kirim Pesan
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}