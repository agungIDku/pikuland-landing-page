import type {
  HomeTestimonialContent,
  HomeTestimonialItem,
} from "@/types/homeContent";
import Image from "next/image";

const FALLBACK_TESTIMONIALS: HomeTestimonialItem[] = [
  {
    name: "Bunda Sarah",
    role: "Ibu dari 2 anak",
    testimonial:
      "Tempat bermain paling bersih dan aman di Jakarta! Anak-anak saya betah banget seharian di sini.",
    star: 5,
    imageUrl: "",
  },
  {
    name: "Pak Budi",
    role: "Ayah si kembar",
    testimonial:
      "Konsep edukasinya dapet banget. Gak cuma lari-larian, tapi anak belajar profesi dan sosialisasi.",
    star: 5,
    imageUrl: "",
  },
  {
    name: "Ibu Dian",
    role: "Guru TK Bintang",
    testimonial:
      "Sangat rekomended untuk field trip sekolah. Fasilitas lengkap dan kakak pendampingnya ramah-ramah.",
    star: 5,
    imageUrl: "",
  },
];

const AVATAR_FALLBACK_COLORS = [
  "bg-[#E5007E]",
  "bg-[#009FE3]",
  "bg-[#FFCB05]",
] as const;

const DEFAULT_SECTION_TITLE = "Apa Kata Mereka?";

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

type TestimonialsSectionProps = {
  testimonialContent?: HomeTestimonialContent;
};

export default function TestimonialsSection({
  testimonialContent,
}: TestimonialsSectionProps) {
  const title = testimonialContent?.title ?? DEFAULT_SECTION_TITLE;
  const items =
    testimonialContent?.items?.length &&
    testimonialContent.items.length > 0
      ? testimonialContent.items
      : FALLBACK_TESTIMONIALS;

  return (
    <section className="relative py-16 md:py-20 px-4 bg-transparent overflow-visible">
      <div className="absolute inset-0 pointer-events-none z-0 overflow-visible">
        <Image
          src="/assets/vector-2.png"
          alt=""
          width={70}
          height={70}
          className="absolute -top-[-30%] right-40 h-auto"
        />
        <Image
          src="/assets/vector-12.png"
          alt=""
          width={200}
          height={200}
          className="absolute -bottom-10 h-auto"
        />
        <Image
          src="/assets/vector-14.png"
          alt=""
          width={180}
          height={100}
          className="absolute -bottom-[-32%] -left-[-20%] h-auto"
        />
      </div>

      <div className="relative max-w-5xl mx-auto z-10">
        <h2 className="text-center text-3xl sm:text-4xl md:text-5xl font-black text-[#263238] mb-16 md:mb-20">
          {title}
        </h2>

        <div className="flex flex-col md:grid md:grid-cols-3 gap-10 md:gap-8 lg:gap-10">
          {items.map((t, index) => (
            <div
              key={`${t.name}-${index}`}
              className="bg-white rounded-[2rem] p-6 md:p-8 shadow-sm hover:shadow-xl transition-all duration-300 relative mt-4 md:mt-2"
            >
              <div
                className={`absolute -top-6 left-6 w-12 h-12 rounded-full flex items-center justify-center text-white shadow-md overflow-hidden ${
                  t.imageUrl
                    ? "bg-white ring-2 ring-white"
                    : AVATAR_FALLBACK_COLORS[index % AVATAR_FALLBACK_COLORS.length]
                }`}
              >
                {t.imageUrl ? (
                  <Image
                    src={t.imageUrl}
                    alt=""
                    width={48}
                    height={48}
                    className="h-full w-full object-cover"
                    unoptimized
                  />
                ) : (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                )}
              </div>

              <div className="mt-4">
                <StarRating count={t.star} />
              </div>

              <p className="mt-4 text-gray-500 text-sm md:text-base italic leading-relaxed font-medium">
                {t.testimonial}
              </p>

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
