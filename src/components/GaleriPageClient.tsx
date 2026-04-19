"use client";

import { GALLERY_PAGE_FALLBACK } from "@/data/galleryDefaults";
import type { GalleryContent, GalleryImageItem } from "@/types/galleryContent";
import Image from "next/image";
import { useMemo, useState } from "react";

type GaleriPageClientProps = {
  initialContent?: GalleryContent;
  /** From `GET client/gallery-types` — overrides `content.categories` when set. */
  categoryTabs?: string[];
  /** From `GET client/galleries` — overrides `content.images` when set. */
  galleryItems?: GalleryImageItem[];
};

export default function GaleriPageClient({
  initialContent,
  categoryTabs,
  galleryItems,
}: GaleriPageClientProps) {
  const content = initialContent ?? GALLERY_PAGE_FALLBACK;
  const { title, subtitle, subtitleHtml } = content;

  const images =
    galleryItems && galleryItems.length > 0 ? galleryItems : content.images;

  const categories =
    categoryTabs && categoryTabs.length > 0
      ? categoryTabs
      : content.categories;

  const [activeTab, setActiveTab] = useState(categories[0] ?? "Semua");

  const filteredImages = useMemo(() => {
    if (activeTab === "Semua") return images;
    return images.filter((img) => (img.category ?? "") === activeTab);
  }, [activeTab, images]);

  const wall = useMemo(
    () => filteredImages.slice(0, 4),
    [filteredImages],
  );

  return (
    <>
      <main className="relative min-h-screen bg-[#FFFBE6] pt-32 pb-24 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-40 z-0">
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
            className="absolute top-[20%] right-[3.5%] md:top-[80%] md:right-[3.5%]"
          />
          <Image
            src="/assets/vector-1.png"
            alt=""
            width={100}
            height={50}
            className="absolute top-[75%] left-[4%] md:top-[100%] md:left-[100%]"
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
          <header className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#1A2E44] mb-4">
              {title}
            </h1>
            {subtitleHtml ? (
              <div
                className="text-base md:text-lg text-slate-500 max-w-2xl mx-auto font-medium [&_p]:mb-0"
                dangerouslySetInnerHTML={{ __html: subtitleHtml }}
              />
            ) : (
              <p className="text-base md:text-lg text-slate-500 max-w-2xl mx-auto font-medium">
                {subtitle}
              </p>
            )}
          </header>

          <div className="flex flex-wrap justify-center gap-3 mb-14">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
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

          {wall.length === 0 ? (
            <p className="text-center text-slate-500 font-medium py-16">
              Tidak ada foto untuk filter ini.
            </p>
          ) : wall.length === 4 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:h-[700px]">
              <GallerySlot image={wall[0]} heightClass="h-[500px] md:h-full" rounded="rounded-[2.5rem]" />
              <div className="grid grid-rows-2 gap-5 h-[600px] md:h-full">
                <GallerySlot image={wall[1]} heightClass="h-full" rounded="rounded-[2rem]" />
                <GallerySlot image={wall[2]} heightClass="h-full" rounded="rounded-[2rem]" />
              </div>
              <GallerySlot image={wall[3]} heightClass="h-[500px] md:h-full" rounded="rounded-[2.5rem]" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {wall.map((img, i) => (
                <GallerySlot
                  key={`${img.src}-${i}`}
                  image={img}
                  heightClass="h-[280px] sm:h-[320px]"
                  rounded="rounded-[2rem]"
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}

function GallerySlot({
  image,
  heightClass,
  rounded,
}: {
  image: GalleryImageItem;
  heightClass: string;
  rounded: string;
}) {
  return (
    <div
      className={`relative overflow-hidden shadow-xl ${heightClass} ${rounded}`}
    >
      <Image
        src={image.src}
        alt={image.alt}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 33vw"
      />
    </div>
  );
}
