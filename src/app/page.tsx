import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import GallerySection from "@/components/GallerySection";
import TestimonialsSection from "@/components/TestimonialsSection";
import CtaBanner from "@/components/CtaBanner";
import { fetchHomeContent } from "@/services/content/home";
import Image from "next/image";

/** CMS fetch uses `cache: "no-store"` — render on each request like tasima home. */
export const dynamic = "force-dynamic";

export default async function Home() {
  const home = await fetchHomeContent();

  return (
    <>
      <main>
        {/* GROUP 1: Hero & Services (Sharing lines-1) */}
        <div className="relative bg-[#FFFBE6]">
          {/* Background overlay spanning both sections */}
          <div
            className="absolute inset-0 pointer-events-none opacity-30 z-0 overflow-hidden"
            aria-hidden="true"
          >
            <Image
              src="/assets/lines-1.png"
              alt=""
              fill
              className="object-cover object-top"
              priority
            />
          </div>
          <div className="relative z-10">
            <HeroSection
              headerContent={home?.headerContent}
              videoContent={home?.videoContent}
            />
            <ServicesSection rideContent={home?.rideContent} />
          </div>
        </div>

        <GallerySection galleryTitle={home?.galleryTitle} />

        {/* GROUP 2: Testimonials & CTA (Sharing lines-3) */}
        <div className="relative bg-[#FFFBE6]">
          {/* Background overlay spanning both sections */}
          <div
            className="absolute inset-0 pointer-events-none opacity-20 z-0 overflow-hidden"
            aria-hidden="true"
          >
            <Image
              src="/assets/lines-3.png"
              alt=""
              fill
              className="object-cover object-top"
            />
          </div>
          <div className="relative z-10">
            <TestimonialsSection
              testimonialContent={home?.testimonialContent}
            />
            <CtaBanner ctaContent={home?.ctaContent} />
          </div>
        </div>
      </main>
    </>
  );
}
