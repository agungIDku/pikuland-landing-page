"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import { useState } from "react";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  Calendar as CalendarIcon,
  Users,
} from "lucide-react";

const tickets = [
  {
    id: "harian",
    title: "Tiket Harian",
    price: "150.000",
    unit: "/ anak",
    features: [
      "Akses seharian penuh",
      "Termasuk 1 pendamping",
      "Akses semua wahana",
      "Free Wifi untuk orang tua",
    ],
    color: "text-[#00AEEF]",
    icon: "📅",
  },
  {
    id: "annual",
    title: "Annual Pass",
    price: "1.500.000",
    unit: "/ tahun",
    features: [
      "Bebas masuk setahun",
      "Diskon ultah 20%",
      "Antrian prioritas",
      "Merchandise eksklusif",
      "Undangan event member",
    ],
    color: "text-[#E5007E]",
    popular: true,
    icon: "👑",
  },
  {
    id: "ultah",
    title: "Paket Ulang Tahun",
    price: "250.000",
    unit: "/ anak (min 10)",
    features: [
      "Ruang pesta privat (2 jam)",
      "Dekorasi tematik",
      "MC & Games seru",
      "Makan siang & Snack",
      "Goodie bag spesial",
    ],
    color: "text-[#FFC107]",
    icon: "⭐",
  },
];

const faqs = [
  {
    q: "Apakah boleh bawa makanan dari luar?",
    a: "Demi kebersihan dan keamanan, makanan dan minuman dari luar tidak diperkenankan. Kami menyediakan food court dengan menu ramah anak.",
  },
  {
    q: "Apakah tiket bisa di-refund?",
    a: "Tiket yang sudah dibeli tidak dapat di-refund, namun dapat dilakukan reschedule maksimal H-1 kunjungan.",
  },
  {
    q: "Apakah pendamping wajib bayar?",
    a: "Satu tiket anak sudah termasuk satu orang pendamping dewasa secara gratis.",
  },
];

export default function TiketPage() {
  const [step, setStep] = useState(1);
  const [counts, setCounts] = useState({ anak: 1, dewasa: 1 });

  const updateCount = (type: "anak" | "dewasa", val: number) => {
    setCounts((prev) => ({ ...prev, [type]: Math.max(0, prev[type] + val) }));
  };

  return (
    <>
      <Navbar />
      <main className="relative min-h-screen bg-[#FFFBE6] pt-28 pb-16 overflow-hidden">
        {/* Background (diabaikan sesuai permintaan, tapi dipertahankan strukturnya) */}
        <div className="absolute inset-0 pointer-events-none opacity-30 z-0">
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
            src="/assets/vector-1.png"
            alt=""
            width={100}
            height={100}
            className="absolute top-[15%] right-[13%] rotate-180 scale-x-[-1]"
          />
          <Image
            src="/assets/vector-10.png"
            alt=""
            width={150}
            height={150}
            className="absolute top-[19%] right-[8%]"
          />
          <Image
            src="/assets/vector-1.png"
            alt=""
            width={100}
            height={50}
            className="absolute top-[45%] left-[2%]"
          />
          <Image
            src="/assets/vector-17.png"
            alt=""
            width={250}
            height={1125}
            className="absolute bottom-[-3%] right-[5%]"
          />
        </div>

        <section className="relative z-10 max-w-7xl mx-auto px-4">
          {/* Header Section */}
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-5xl font-black text-[#1A2E44] mb-4">
              {step === 1 ? "Pilih Tiket Petualanganmu!" : "Kapan Mau Main?"}
            </h1>
            <p className="text-slate-500 max-w-xl mx-auto font-medium">
              {step === 1
                ? "Main sepuasnya, belajar sebanyaknya. Pilih paket yang paling pas untuk keluarga."
                : "Pilih tanggal kunjungan dan jumlah petualang kecil yang akan bermain."}
            </p>
          </div>

          {/* Stepper Indicator */}
          <div className="flex justify-center mb-16">
            <div className="bg-white/80 backdrop-blur rounded-full px-8 py-3 shadow-sm border border-yellow-100 flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${step >= 1 ? "bg-[#E5007E] text-white" : "bg-slate-200 text-slate-500"}`}
                >
                  {step > 1 ? <Check size={14} /> : "1"}
                </span>
                <span
                  className={`text-sm font-bold ${step >= 1 ? "text-[#E5007E]" : "text-slate-400"}`}
                >
                  Pilih Tiket
                </span>
              </div>
              <div
                className={`h-[2px] w-12 ${step >= 2 ? "bg-[#E5007E]" : "bg-slate-200"}`}
              ></div>
              <div className="flex items-center gap-2">
                <span
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${step >= 2 ? "bg-[#E5007E] text-white" : "bg-slate-200 text-slate-500"}`}
                >
                  {step > 2 ? <Check size={14} /> : "2"}
                </span>
                <span
                  className={`text-sm font-bold ${step >= 2 ? "text-[#E5007E]" : "text-slate-400"}`}
                >
                  Tanggal
                </span>
              </div>
              <div
                className={`h-[2px] w-12 ${step >= 3 ? "bg-[#E5007E]" : "bg-slate-200"}`}
              ></div>
              <div className="flex items-center gap-2">
                <span
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${step === 3 ? "bg-[#E5007E] text-white" : "bg-slate-200 text-slate-500"}`}
                >
                  3
                </span>
                <span
                  className={`text-sm font-bold ${step === 3 ? "text-[#E5007E]" : "text-slate-400"}`}
                >
                  Bayar
                </span>
              </div>
            </div>
          </div>

          {/* STEP 1: PILIH TIKET */}
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20">
                {tickets.map((t) => (
                  <div
                    key={t.id}
                    className={`relative bg-white rounded-[2.5rem] p-8 shadow-xl border border-slate-50 flex flex-col ${t.popular ? "ring-4 ring-[#E5007E]/10" : ""}`}
                  >
                    {t.popular && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#E5007E] text-white text-[10px] font-black px-5 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                        Paling Hemat!
                      </div>
                    )}
                    <div
                      className={`w-14 h-14 rounded-2xl mb-6 flex items-center justify-center text-2xl shadow-inner ${t.id === "harian" ? "bg-cyan-50" : t.id === "annual" ? "bg-pink-50" : "bg-yellow-50"}`}
                    >
                      {t.icon}
                    </div>
                    <h3 className="text-xl font-black text-[#1A2E44] mb-1">
                      {t.title}
                    </h3>
                    <div className="mb-8">
                      <span className={`text-2xl font-black ${t.color}`}>
                        Rp {t.price}
                      </span>
                      <span className="text-slate-400 text-sm font-medium">
                        {" "}
                        {t.unit}
                      </span>
                    </div>
                    <ul className="space-y-4 mb-10 flex-grow">
                      {t.features.map((f, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-3 text-sm text-slate-600 font-medium leading-tight"
                        >
                          <Check
                            size={16}
                            className={`${t.color} mt-0.5 shrink-0`}
                          />{" "}
                          {f}
                        </li>
                      ))}
                    </ul>
                    <button
                      onClick={() => setStep(2)}
                      className={`w-full py-3.5 rounded-full font-bold transition-all ${t.popular ? "bg-[#E5007E] text-white shadow-lg hover:brightness-110" : "bg-slate-50 text-slate-600 hover:bg-slate-100"}`}
                    >
                      Pilih Tiket
                    </button>
                  </div>
                ))}
              </div>

              {/* FAQ SECTION */}
              <div className="max-w-3xl mx-auto bg-white/60 backdrop-blur rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-yellow-100">
                <h2 className="text-2xl font-black text-[#1A2E44] text-center mb-8">
                  Pertanyaan Sering Diajukan
                </h2>
                <div className="space-y-4">
                  {faqs.map((faq, i) => (
                    <details
                      key={i}
                      className="group border-b border-slate-100 last:border-0 pb-4"
                    >
                      <summary className="flex items-center justify-between cursor-pointer font-bold text-[#1A2E44] list-none">
                        {faq.q}
                        <ChevronRight
                          size={18}
                          className="group-open:rotate-90 transition-transform text-slate-400"
                        />
                      </summary>
                      <p className="mt-3 text-sm text-slate-500 leading-relaxed">
                        {faq.a}
                      </p>
                    </details>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: PILIH TANGGAL */}
          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto">
              <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-2xl border border-slate-100">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  {/* Left Side: Calendar */}
                  <div>
                    <div className="flex items-center gap-2 mb-6">
                      <CalendarIcon className="text-cyan-500" size={20} />
                      <h3 className="text-xl font-black text-[#1A2E44]">
                        Pilih Tanggal
                      </h3>
                    </div>
                    <div className="border border-slate-100 rounded-3xl p-6">
                      <div className="flex items-center justify-between mb-6 px-2">
                        <span className="font-black text-[#1A2E44]">
                          Oktober 2023
                        </span>
                        <div className="flex gap-2">
                          <button className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-400">
                            <ChevronLeft size={20} />
                          </button>
                          <button className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-400">
                            <ChevronRight size={20} />
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-400 uppercase tracking-tighter mb-4">
                        {["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"].map(
                          (d) => (
                            <div key={d}>{d}</div>
                          ),
                        )}
                      </div>
                      <div className="grid grid-cols-7 gap-1">
                        {Array.from({ length: 31 }, (_, i) => i + 1).map(
                          (day) => (
                            <button
                              key={day}
                              className={`aspect-square flex items-center justify-center rounded-full text-sm font-bold transition-colors ${day === 24 ? "bg-[#E5007E] text-white shadow-lg" : "hover:bg-pink-50 text-[#1A2E44]"}`}
                            >
                              {day}
                            </button>
                          ),
                        )}
                      </div>
                    </div>
                    <div className="mt-4 p-4 bg-yellow-50 rounded-2xl border border-yellow-100 flex gap-3 items-start">
                      <span className="text-lg">⚠️</span>
                      <p className="text-[11px] text-yellow-700 font-medium leading-relaxed">
                        Tiket berlaku hanya untuk tanggal yang dipilih.
                        Reschedule maksimal H-1.
                      </p>
                    </div>
                  </div>

                  {/* Right Side: Counters */}
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 mb-6">
                      <Users className="text-yellow-500" size={20} />
                      <h3 className="text-xl font-black text-[#1A2E44]">
                        Jumlah Pengunjung
                      </h3>
                    </div>
                    <div className="space-y-4 flex-grow">
                      {[
                        {
                          label: "Anak-anak",
                          sub: "Usia 1 - 12 Tahun",
                          key: "anak",
                        },
                        {
                          label: "Dewasa",
                          sub: "Usia 17+ Tahun",
                          key: "dewasa",
                        },
                      ].map((item) => (
                        <div
                          key={item.key}
                          className="flex items-center justify-between p-6 bg-slate-50 rounded-[2rem] border border-slate-100"
                        >
                          <div>
                            <p className="font-black text-[#1A2E44]">
                              {item.label}
                            </p>
                            <p className="text-xs text-slate-400 font-medium">
                              {item.sub}
                            </p>
                          </div>
                          <div className="flex items-center gap-4 bg-white rounded-full px-2 py-2 shadow-sm border border-slate-100">
                            <button
                              onClick={() =>
                                updateCount(item.key as "anak" | "dewasa", -1)
                              }
                              className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-50 text-slate-400 hover:text-pink-500"
                            >
                              <Minus size={16} />
                            </button>
                            <span className="w-6 text-center font-black text-lg">
                              {counts[item.key as "anak" | "dewasa"]}
                            </span>
                            <button
                              onClick={() =>
                                updateCount(item.key as "anak" | "dewasa", 1)
                              }
                              className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-50 text-slate-400 hover:text-pink-500"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-8 flex gap-4">
                      <button
                        onClick={() => setStep(1)}
                        className="flex-1 py-4 rounded-full font-black text-slate-400 border-2 border-slate-100 hover:bg-slate-50 flex items-center justify-center gap-2"
                      >
                        <ChevronLeft size={20} /> Kembali
                      </button>
                      <button className="flex-[2] py-4 rounded-full font-black text-white bg-[#E5007E] shadow-xl shadow-pink-200 hover:brightness-110 transition-all">
                        Lanjut Pembayaran
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
