import Image from "next/image";

const testimonials = [
  {
    name: "Bunda Sarah",
    role: "Ibu dari 2 anak",
    quote:
      "Tempat bermain paling bersih dan aman di Jakarta! Anak-anak saya betah banget seharian di sini.",
    rating: 5,
    avatarColor: "bg-[#E5007E]",
  },
  {
    name: "Pak Budi",
    role: "Ayah si kembar",
    quote:
      "Konsep edukasinya dapet banget. Gak cuma lari-larian, tapi anak belajar profesi dan sosialisasi.",
    rating: 5,
    avatarColor: "bg-[#009FE3]",
  },
  {
    name: "Ibu Dian",
    role: "Guru TK Bintang",
    quote:
      "Sangat rekomended untuk field trip sekolah. Fasilitas lengkap dan kakak pendampingnya ramah-ramah.",
    rating: 5,
    avatarColor: "bg-[#FFCB05]",
  },
];

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <svg
          key={i}
          className="w-4 h-4 text-yellow fill-current"
          viewBox="0 0 24 24"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

export default function TestimonialsSection() {
  return (
    <section className="relative py-16 md:py-20 px-4 bg-transparent overflow-visible">
      {/* Lines background is now handled by the parent wrapper in page.tsx */}

      {/* Decorative Vectors Testimonial */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-visible">
        <Image src="/assets/vector-2.png" alt="" width={70} height={70} className="absolute -top-[-30%] right-40 h-auto" />
        <Image src="/assets/vector-12.png" alt="" width={200} height={200} className="absolute -bottom-10 h-auto" />
        <Image src="/assets/vector-14.png" alt="" width={180} height={100} className="absolute -bottom-[-32%] -left-[-20%] h-auto" />
      </div>

      <div className="relative max-w-5xl mx-auto z-10">
        {/* Section heading */}
        <h2 className="text-center text-3xl sm:text-4xl md:text-5xl font-black text-[#263238] mb-16 md:mb-20">
          Apa Kata Mereka?
        </h2>

        {/* Testimonial cards — stacked on mobile, 3-column on desktop */}
        <div className="flex flex-col md:grid md:grid-cols-3 gap-10 md:gap-8 lg:gap-10">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="bg-white rounded-[2rem] p-6 md:p-8 shadow-sm hover:shadow-xl transition-all duration-300 relative mt-4 md:mt-2"
            >
              {/* Floating Avatar */}
              <div
                className={`absolute -top-6 left-6 w-12 h-12 ${t.avatarColor} rounded-full flex items-center justify-center text-white shadow-md`}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>

              {/* Stars */}
              <div className="mt-4">
                <StarRating count={t.rating} />
              </div>

              {/* Quote */}
              <p className="mt-4 text-gray-500 text-sm md:text-base italic leading-relaxed font-medium">
                "{t.quote}"
              </p>

              {/* Author */}
              <div className="mt-8 md:mt-10">
                <p className="font-extrabold text-[#263238] text-base">
                  {t.name}
                </p>
                <p className="text-[10px] md:text-xs text-gray-400 uppercase tracking-widest mt-1 font-bold">
                  {t.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
