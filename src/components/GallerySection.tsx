import Image from "next/image";

const galleryImages = [
  { src: "/assets/petualangan-tak-terbatas.png", alt: "Anak bermain di area petualangan Pikuland" },
  { src: "/assets/kolam-bola-raksasa.png", alt: "Kolam bola warna-warni Pikuland" },
  { src: "/assets/panjat-tebing-aman.png", alt: "Wall climbing untuk anak di Pikuland" },
  { src: "/assets/gameplay-preview.png", alt: "Taman bermain Pikuland" },
];

export default function GallerySection() {
  return (
    <section className="relative py-16 md:py-20 px-4 bg-[#E1F5FE] overflow-visible">
      
      {/* Decorative Vectors Gallery */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-visible">
        <Image src="/assets/vector-7.png" alt="" width={50} height={100} className="absolute -top-[-50%] right-[10%] h-auto" />
        <Image src="/assets/vector-3.png" alt="" width={80} height={80} className="absolute -bottom-[-10%] right-[7%] h-auto" />
        <Image src="/assets/vector-4.png" alt="" width={150} height={100} className="absolute -top-[-22%] left-[8%] h-auto" />
      </div>

      <div className="relative max-w-6xl mx-auto z-10">
        {/* Section heading */}
        <h2 className="text-center text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-blue-dark mb-8 md:mb-12">
          Lihat Keseruan Anak di Pikuland
        </h2>

        {/* Gallery grid — 3 columns bento-style (Tall left, 2 stacked middle, Tall right) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mt-10 md:mt-16 w-full max-w-5xl mx-auto">
          {/* Left Column (Tall Image 1) */}
          <div className="relative rounded-3xl overflow-hidden shadow-xl min-h-[300px] md:min-h-[500px]">
            <Image
              src={galleryImages[0].src}
              alt={galleryImages[0].alt}
              fill
              className="object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>

          {/* Middle Column (2 Stacked Images) */}
          <div className="flex flex-col gap-4 md:gap-6">
            <div className="relative flex-1 rounded-3xl overflow-hidden shadow-xl min-h-[200px] md:min-h-[238px]">
              <Image
                src={galleryImages[1].src}
                alt={galleryImages[1].alt}
                fill
                className="object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="relative flex-1 rounded-3xl overflow-hidden shadow-xl min-h-[200px] md:min-h-[238px]">
              <Image
                src={galleryImages[3].src}
                alt={galleryImages[3].alt}
                fill
                className="object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>

          {/* Right Column (Tall Image 2) */}
          <div className="relative rounded-3xl overflow-hidden shadow-xl min-h-[300px] md:min-h-[500px]">
            <Image
              src={galleryImages[2].src}
              alt={galleryImages[2].alt}
              fill
              className="object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
