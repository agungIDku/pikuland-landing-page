"use client";

import { CAREER_PAGE_FALLBACK } from "@/data/careerDefaults";
import { CAREER_JOBS_FALLBACK } from "@/data/careerJobsFallback";
import type { CareerContent } from "@/types/careerContent";
import type { CareerJob } from "@/types/careerJob";
import Image from "next/image";
import { Smile, Heart, BookOpen, ChevronDown } from "lucide-react";

const VALUE_ICONS = [
  <Smile key="v1" className="text-yellow-500" size={32} />,
  <Heart key="v2" className="text-pink-500" size={32} />,
  <BookOpen key="v3" className="text-cyan-500" size={32} />,
] as const;

const VALUE_BGS = ["bg-yellow-50", "bg-pink-50", "bg-cyan-50"] as const;

function descriptionIsHtml(s: string): boolean {
  return /<[^>]+>/.test(s);
}

type KarirPageClientProps = {
  content?: CareerContent;
  jobs?: CareerJob[];
};

function CareerHeroTitle({ title }: { title: string }) {
  const trimmed = title.trim();
  if (!trimmed) {
    return (
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#1A2E44] mb-6" />
    );
  }

  const firstSpace = trimmed.search(/\s/);
  if (firstSpace === -1) {
    return (
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6">
        <span className="text-[#E5007E]">{trimmed}</span>
      </h1>
    );
  }

  const firstWord = trimmed.slice(0, firstSpace);
  const rest = trimmed.slice(firstSpace);

  return (
    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#1A2E44] mb-6">
      <span className="text-[#E5007E]">{firstWord}</span>
      {rest}
    </h1>
  );
}

function CareerJobCard({ job, defaultOpen }: { job: CareerJob; defaultOpen: boolean }) {
  const desc = job.description?.trim() ?? "";
  const html = desc && descriptionIsHtml(desc);

  return (
    <details
      open={defaultOpen}
      className="group rounded-[2rem] border border-slate-100 bg-white overflow-hidden transition-all open:border-[#E5007E] open:border-2"
    >
      <summary className="flex cursor-pointer items-center justify-between p-6 md:p-8 list-none outline-none">
        <div className="flex flex-col gap-3">
          <h3 className="text-lg md:text-xl font-black text-[#1A2E44] group-open:text-[#E5007E] transition-colors">
            {job.title}
          </h3>
          <div className="flex flex-wrap gap-2">
            <span className="bg-[#26C1ED] text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
              {job.department}
            </span>
            <span className="bg-slate-100 text-slate-500 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
              {job.type}
            </span>
          </div>
        </div>
        <ChevronDown
          className="text-slate-300 group-open:rotate-180 transition-transform shrink-0"
          size={24}
        />
      </summary>

      <div className="px-6 md:px-8 pb-8 pt-2">
        {html ? (
          <div
            className="text-sm text-slate-500 leading-relaxed mb-6 font-medium max-w-none [&_p]:mb-3 [&_strong]:text-[#1A2E44]"
            dangerouslySetInnerHTML={{ __html: desc }}
          />
        ) : desc ? (
          <p className="text-sm text-slate-500 leading-relaxed mb-6 font-medium whitespace-pre-wrap">
            {desc}
          </p>
        ) : null}

        {job.location ? (
          <p className="text-sm text-slate-600 font-bold mb-4">
            Lokasi:{" "}
            <span className="font-medium text-slate-500">{job.location}</span>
          </p>
        ) : null}

        {job.qualifications && job.qualifications.length > 0 ? (
          <div className="mb-6">
            <h4 className="font-black text-[#1A2E44] text-sm mb-3">
              Kualifikasi:
            </h4>
            <ul className="space-y-2">
              {job.qualifications.map((q, i) => (
                <li
                  key={i}
                  className="text-sm text-slate-500 flex items-center gap-2 font-medium"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />{" "}
                  {q}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pt-6 border-t border-slate-50">
          <div>
            <p className="text-sm font-black text-[#1A2E44]">
              Kirim CV kamu ke :
            </p>
            <a
              href={`mailto:${job.email}`}
              className="text-[#00AEEF] font-bold text-sm hover:underline"
            >
              {job.email}
            </a>
          </div>
          {job.dueDateLabel ? (
            <p className="text-[11px] italic text-red-500 font-medium">
              *Lowongan Berakhir {job.dueDateLabel}
            </p>
          ) : null}
        </div>
      </div>
    </details>
  );
}

export default function KarirPageClient({ content, jobs }: KarirPageClientProps) {
  const c = content ?? CAREER_PAGE_FALLBACK;
  const heroDescHtml = descriptionIsHtml(c.description);

  const jobList =
    jobs && jobs.length > 0 ? jobs : CAREER_JOBS_FALLBACK;

  return (
    <>
      <main className="relative min-h-screen bg-[#FFFDF0] pt-28 pb-24 overflow-hidden">
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
          <header className="mb-16 text-center flex flex-col items-center">
            <div className="bg-[#E0F7FF] text-[#00AEEF] px-6 py-2 rounded-full text-xs font-black tracking-widest mb-6 shadow-sm max-w-[95%] text-center leading-snug">
              {c.preTitle}
            </div>
            <CareerHeroTitle title={c.title} />
            {heroDescHtml ? (
              <div
                className="text-slate-500 max-w-2xl leading-relaxed font-medium [&_p]:mb-0"
                dangerouslySetInnerHTML={{ __html: c.description }}
              />
            ) : (
              <p className="text-slate-500 max-w-2xl leading-relaxed font-medium">
                {c.description}
              </p>
            )}
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24 max-w-5xl mx-auto">
            {c.values.map((benefit, idx) => (
              <div
                key={`${benefit.title}-${idx}`}
                className="flex flex-col text-center items-center p-8 bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-50 transition-transform hover:-translate-y-2"
              >
                <div
                  className={`w-16 h-16 rounded-2xl ${VALUE_BGS[idx]} flex items-center justify-center mb-6 shadow-inner`}
                >
                  {VALUE_ICONS[idx]}
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

          <div className="max-w-4xl mx-auto bg-white rounded-[3rem] p-6 md:p-12 shadow-2xl border border-slate-50">
            <h2 className="text-3xl font-black text-[#1A2E44] text-center mb-10">
              {c.openPositionLabel}
            </h2>

            <div className="space-y-4">
              {jobList.map((job, index) => (
                <CareerJobCard
                  key={job.id}
                  job={job}
                  defaultOpen={index === 0}
                />
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
