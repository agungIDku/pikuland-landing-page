import type { CareerJob } from "@/types/careerJob";

/** Shown when `client/careers` fails or returns empty. */
export const CAREER_JOBS_FALLBACK: CareerJob[] = [
  {
    id: "facilitator",
    title: "Play Fasilitator (Kakak Pendamping)",
    department: "Operasional",
    type: "Full Time / Part Time",
    description:
      "Bertanggung jawab mendampingi anak-anak bermain, memastikan keamanan, dan menciptakan suasana ceria di setiap wahana.",
    qualifications: [
      "Usia 18-25 tahun",
      "Suka anak-anak & energik",
      "Pendidikan minimal SMA/SMK",
      "Bersedia kerja shift & weekend",
    ],
    dueDateLabel: "23 Januari 2026",
    email: "careers@pikuland.com",
  },
  {
    id: "cs",
    title: "Customer Service Officer",
    department: "Front Office",
    type: "Full Time",
    description: "",
    dueDateLabel: "",
    email: "careers@pikuland.com",
  },
  {
    id: "event",
    title: "Creative Event Staff",
    department: "Marketing",
    type: "Full Time",
    description: "",
    dueDateLabel: "",
    email: "careers@pikuland.com",
  },
  {
    id: "cleaning",
    title: "Cleaning Crew",
    department: "Facility",
    type: "Full Time",
    description: "",
    dueDateLabel: "",
    email: "careers@pikuland.com",
  },
];
