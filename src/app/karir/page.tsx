"use client";

import Image from "next/image";
import { Smile, Heart, BookOpen, ChevronDown } from "lucide-react";

const benefits = [
  {
    title: "Fun Environment",
    description: "Kerja rasa main, bebas stres, dan penuh kreativitas.",
    icon: <Smile className="text-yellow-500" size={32} />,
    bg: "bg-yellow-50",
  },
  {
    title: "Health & Bonus",
    description: "BPJS, tunjangan kesehatan, dan bonus performa menarik.",
    icon: <Heart className="text-pink-500" size={32} />,
    bg: "bg-pink-50",
  },
  {
    title: "Training",
    description: "Pelatihan soft skill dan pengembangan karir berkala.",
    icon: <BookOpen className="text-cyan-500" size={32} />,
    bg: "bg-cyan-50",
  },
];

const jobs = [
  {
    id: "facilitator",
    title: "Play Fasilitator (Kakak Pendamping)",
    category: "Operasional",
    type: "Full Time / Part Time",
    description:
      "Bertanggung jawab mendampingi anak-anak bermain, memastikan keamanan, dan menciptakan suasana ceria di setiap wahana.",
    qualifications: [
      "Usia 18-25 tahun",
      "Suka anak-anak & energik",
      "Pendidikan minimal SMA/SMK",
      "Bersedia kerja shift & weekend",
    ],
    deadline: "23 Januari 2026",
    isOpen: true,
  },
  {
    id: "cs",
    title: "Customer Service Officer",
    category: "Front Office",
    type: "Full Time",
    isOpen: false,
  },
  {
    id: "event",
    title: "Creative Event Staff",
    category: "Marketing",
    type: "Full Time",
    isOpen: false,
  },
  {
    id: "cleaning",
    title: "Cleaning Crew",
    category: "Facility",
    type: "Full Time",
    isOpen: false,
  },
];

export default function KarirPage() {
  return (
    <>
      <main className="relative min-h-screen bg-[#FFFDF0] pt-28 pb-24 overflow-hidden">
        {/* Background & Vector (Diabaikan sesuai instruksi) */}
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
            src="/assets/vector-16.png"
            alt=""
            width={180}
            height={180}
            className="absolute top-[5%] right-[3.5%]"
          />
          <Image
            src="/assets/vector-1.png"
            alt=""
            width={100}
            height={50}
            className="absolute top-[35%] left-[4%]"
          />
          <Image
            src="/assets/vector-11.png"
            alt=""
            width={100}
            height={50}
            className="absolute bottom-[35%] right-[13%]"
          />
          <Image
            src="/assets/vector-11.png"
            alt=""
            width={100}
            height={50}
            className="absolute bottom-[35%] left-[13%] rotate-180"
          />
        </div>

        <section className="relative z-10 max-w-6xl mx-auto px-4">
          {/* HEADER */}
          <header className="mb-16 text-center flex flex-col items-center">
            <div className="bg-[#E0F7FF] text-[#00AEEF] px-6 py-2 rounded-full text-xs font-black tracking-widest mb-6 shadow-sm">
              JOIN OUR TEAM
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#1A2E44] mb-6">
              Bekerja Sambil <span className="text-[#E5007E]">Bermain!</span>
            </h1>
            <p className="text-slate-500 max-w-2xl leading-relaxed font-medium">
              Pikuland bukan sekadar tempat kerja, tapi rumah kedua di mana kita
              menciptakan senyum anak-anak setiap hari. Lingkungan kerja
              suportif, seru, dan penuh tawa menantimu!
            </p>
          </header>

          {/* BENEFIT CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24 max-w-5xl mx-auto">
            {benefits.map((benefit, idx) => (
              <div
                key={idx}
                className="flex flex-col text-center items-center p-8 bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-50 transition-transform hover:-translate-y-2"
              >
                <div
                  className={`w-16 h-16 rounded-2xl ${benefit.bg} flex items-center justify-center mb-6 shadow-inner`}
                >
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-black text-[#1A2E44] mb-3">
                  {benefit.title}
                </h3>
                <p className="text-sm text-slate-400 font-medium leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>

          {/* POSISI TERSEDIA CONTAINER */}
          <div className="max-w-4xl mx-auto bg-white rounded-[3rem] p-6 md:p-12 shadow-2xl border border-slate-50">
            <h2 className="text-3xl font-black text-[#1A2E44] text-center mb-10">
              Posisi Tersedia
            </h2>

            <div className="space-y-4">
              {jobs.map((job) => (
                <details
                  key={job.id}
                  open={job.isOpen}
                  className="group rounded-[2rem] border border-slate-100 bg-white overflow-hidden transition-all open:border-[#E5007E] open:border-2"
                >
                  <summary className="flex cursor-pointer items-center justify-between p-6 md:p-8 list-none outline-none">
                    <div className="flex flex-col gap-3">
                      <h3 className="text-lg md:text-xl font-black text-[#1A2E44] group-open:text-[#E5007E] transition-colors">
                        {job.title}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        <span className="bg-[#26C1ED] text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                          {job.category}
                        </span>
                        <span className="bg-slate-100 text-slate-500 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                          {job.type}
                        </span>
                      </div>
                    </div>
                    <ChevronDown
                      className="text-slate-300 group-open:rotate-180 transition-transform"
                      size={24}
                    />
                  </summary>

                  {job.description && (
                    <div className="px-6 md:px-8 pb-8 pt-2">
                      <p className="text-sm text-slate-500 leading-relaxed mb-6 font-medium">
                        {job.description}
                      </p>

                      <div className="mb-6">
                        <h4 className="font-black text-[#1A2E44] text-sm mb-3">
                          Kualifikasi:
                        </h4>
                        <ul className="space-y-2">
                          {job.qualifications?.map((q, i) => (
                            <li
                              key={i}
                              className="text-sm text-slate-500 flex items-center gap-2 font-medium"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />{" "}
                              {q}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pt-6 border-t border-slate-50">
                        <div>
                          <p className="text-sm font-black text-[#1A2E44]">
                            Kirim CV kamu ke :
                          </p>
                          <p className="text-[#00AEEF] font-bold text-sm">
                            careers@pikuland.com
                          </p>
                        </div>
                        <p className="text-[11px] italic text-red-500 font-medium">
                          *Lowongan Berakhir {job.deadline}
                        </p>
                      </div>
                    </div>
                  )}
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
