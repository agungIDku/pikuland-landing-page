import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import GallerySection from "@/components/GallerySection";
import TestimonialsSection from "@/components/TestimonialsSection";
import CtaBanner from "@/components/CtaBanner";
import Footer from "@/components/Footer";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        {/* GROUP 1: Hero & Services (Sharing lines-1) */}
        <div className="relative bg-[#FFFBE6]">
          {/* Background overlay spanning both sections */}
          <div className="absolute inset-0 pointer-events-none opacity-30 z-0 overflow-hidden" aria-hidden="true">
            <Image src="/assets/lines-1.png" alt="" fill className="object-cover object-top" priority />
          </div>
          <div className="relative z-10">
            <HeroSection />
            <ServicesSection />
          </div>
        </div>
        
        <GallerySection />
        
        {/* GROUP 2: Testimonials & CTA (Sharing lines-3) */}
        <div className="relative bg-[#FFFBE6]">
           {/* Background overlay spanning both sections */}
          <div className="absolute inset-0 pointer-events-none opacity-20 z-0 overflow-hidden" aria-hidden="true">
            <Image src="/assets/lines-3.png" alt="" fill className="object-cover object-top" />
          </div>
          <div className="relative z-10">
            <TestimonialsSection />
            <CtaBanner />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
