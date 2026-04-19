import type { HomeRideContent } from "@/types/homeContent";
import Image from "next/image";
import Link from "next/link";

const DEFAULT_RIDE: HomeRideContent = {
  buttonSeeAllRides: "Lihat Semua Wahana",
  preTitle: "WAHANA SERU",
  title: "Petualangan Tanpa Batas",
};

const services = [
  {
    title: "Kolam Bola",
    description: "Berenang di lautan ribuan bola warna-warni!",
    image: "/assets/kolam-bola-raksasa.png",
    color: "#009FE3", // Biru
  },
  {
    title: "Area Profesi",
    description: "Jadilah dokter, koki, atau pemadam kebakaran.",
    image: "/assets/gameplay-preview.png", 
    color: "#E5007E", // Pink
  },
  {
    title: "Wall Climbing",
    description: "Tantang keberanianmu memanjat tebing aman.",
    image: "/assets/panjat-tebing-aman.png",
    color: "#FFCB05", // Kuning
  },
  {
    title: "Creative Studio",
    description: "Tuangkan imajinasi lewat seni dan kerajinan.",
    image: "/assets/workshop-kerajinan.png", 
    color: "#8E24AA", // Ungu
  },
];

type ServicesSectionProps = {
  rideContent?: HomeRideContent;
};

export default function ServicesSection({ rideContent }: ServicesSectionProps) {
  const ride = rideContent ?? DEFAULT_RIDE;

  return (
    <section className="relative py-16 md:py-20 px-4 bg-transparent overflow-visible">
      {/* Background lines is now controlled by the parent wrapper in page.tsx */}

      {/* Decorative vectors crossing into Gallery */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-visible">
        <Image src="/assets/vector-13.png" alt="" width={90} height={90} className="absolute -bottom-14 right-20 h-auto object-contain z-10" />
        <Image src="/assets/vector-5.png" alt="" width={450} height={350} className="absolute -bottom-[-5%] right-[5%] h-auto object-contain z-20" />
      </div>

      <div className="relative max-w-6xl mx-auto z-10">
        {/* Section header */}
        <div className="text-center mb-10 md:mb-12">
          <span className="text-[#E5007E] font-extrabold text-sm tracking-[0.2em] uppercase">
            {ride.preTitle}
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl md:text-5xl font-black text-[#263238]">
            {ride.title}
          </h2>
        </div>

        {/* Uniform cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {services.map((service) => (
            <div
              key={service.title}
              className="group relative rounded-[2rem] overflow-hidden flex flex-col shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 h-full min-h-[380px]"
            >
              {/* Image Container — Top Half */}
              <div className="relative h-48 sm:h-52 bg-white flex-shrink-0">
                {service.image ? (
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-white"></div>
                )}
              </div>

              {/* Content Container — Bottom Half (Colored) */}
              <div 
                className="p-6 flex-grow flex flex-col justify-start relative overflow-hidden"
                style={{ backgroundColor: service.color }}
              >
                {/* Lighter top-border effect seen in design (e.g light blue on top of blue) */}
                <div className="absolute top-0 left-0 w-full h-2 bg-white/20"></div>

                <h3 className="text-xl font-bold text-white mb-2">
                  {service.title}
                </h3>
                <p className="text-sm text-white/90 leading-relaxed font-medium">
                  {service.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA link */}
        <div className="mt-10 md:mt-12 flex justify-start lg:ml-2">
          <Link
            href="/tiket"
            className="inline-flex items-center justify-center bg-[#009FE3] text-white font-extrabold text-sm md:text-base px-8 py-3.5 rounded-full hover:bg-[#009FE3]/90 transition-all hover:scale-105 shadow-md"
          >
            {ride.buttonSeeAllRides}
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
