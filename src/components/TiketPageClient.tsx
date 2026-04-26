"use client";

import { TICKET_PAGE_FALLBACK } from "@/data/ticketDefaults";
import {
  buildHolidateKeySet,
  fetchHolidateForMonthClient,
  localDateKeyFromCalendarParts,
} from "@/services/ticketing/holidate";
import {
  formatSellingPriceIdr,
  type TicketingProduct,
} from "@/services/ticketing/products";
import {
  fetchCheckoutClient,
  fetchVisitsClient,
  formatDateParamForVisits,
} from "@/services/ticketing/visitsCheckoutClient";
import type { VisitsData } from "@/services/ticketing/visitsCheckoutTypes";
import type { TicketContent } from "@/types/ticketContent";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Minus,
  Plus,
  Calendar as CalendarIcon,
  Users,
  CreditCard,
} from "lucide-react";

function ticketingAccent(color: string): { text: string; iconBg: string } {
  const k = color.toLowerCase().trim();
  if (k === "yellow" || k === "gold")
    return { text: "text-[#FFC107]", iconBg: "bg-yellow-50" };
  if (k === "pink" || k === "magenta" || k === "rose")
    return { text: "text-[#E5007E]", iconBg: "bg-pink-50" };
  if (k === "cyan" || k === "blue" || k === "teal")
    return { text: "text-[#00AEEF]", iconBg: "bg-cyan-50" };
  if (k === "green")
    return { text: "text-emerald-600", iconBg: "bg-emerald-50" };
  if (k === "orange")
    return { text: "text-orange-500", iconBg: "bg-orange-50" };
  return { text: "text-[#00AEEF]", iconBg: "bg-cyan-50" };
}

function looksLikeHtml(s: string): boolean {
  return /<[^>]+>/.test(s);
}

function startOfLocalDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function sameLocalDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function formatIdDateLong(d: Date): string {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);
}

function buildMonthGrid(year: number, monthIndex: number): (number | null)[] {
  const first = new Date(year, monthIndex, 1);
  const pad = first.getDay();
  const dim = new Date(year, monthIndex + 1, 0).getDate();
  const cells: (number | null)[] = [];
  for (let i = 0; i < pad; i++) cells.push(null);
  for (let d = 1; d <= dim; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

type TiketPageClientProps = {
  content?: TicketContent;
  /** From RSC: real product list in first HTML for SEO; passed through to this client island for interactivity. */
  products: TicketingProduct[];
  productsError: string | null;
};

export default function TiketPageClient({
  content,
  products,
  productsError,
}: TiketPageClientProps) {
  const c = content ?? TICKET_PAGE_FALLBACK;
  const checkout = c.ticketCheckoutPage;
  const f = checkout.form;

  const visitorRows = [
    {
      key: "anak" as const,
      label: f.children.label,
      sub: f.children.detailInfo,
    },
    {
      key: "dewasa" as const,
      label: f.adult.label,
      sub: f.adult.detailInfo,
    },
  ];

  const [step, setStep] = useState(1);
  const [counts, setCounts] = useState({ anak: 1, dewasa: 1 });
  /** First day of the month being shown in the date picker. */
  const [viewDate, setViewDate] = useState(() => {
    const n = new Date();
    return new Date(n.getFullYear(), n.getMonth(), 1);
  });
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedProduct, setSelectedProduct] =
    useState<TicketingProduct | null>(null);
  const [holidateIsoDates, setHolidateIsoDates] = useState<string[]>([]);
  const [visitDetail, setVisitDetail] = useState<VisitsData | null>(null);
  const [visitsLoading, setVisitsLoading] = useState(false);
  const [visitsError, setVisitsError] = useState<string | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [custName, setCustName] = useState("");
  const [custEmail, setCustEmail] = useState("");
  const [custPhone, setCustPhone] = useState("");

  useEffect(() => {
    if (step === 1) {
      queueMicrotask(() => setSelectedDate(null));
    }
    if (step === 2) {
      setVisitDetail(null);
      setVisitsError(null);
      setCheckoutError(null);
      const n = new Date();
      queueMicrotask(() => {
        setViewDate(new Date(n.getFullYear(), n.getMonth(), 1));
      });
    }
  }, [step]);

  const calYear = viewDate.getFullYear();
  const calMonthIndex = viewDate.getMonth();

  useEffect(() => {
    if (step !== 2) return;
    const month1to12 = calMonthIndex + 1;
    let cancelled = false;
    void fetchHolidateForMonthClient(month1to12).then((dates) => {
      if (!cancelled) setHolidateIsoDates(dates);
    });
    return () => {
      cancelled = true;
    };
  }, [step, calYear, calMonthIndex]);

  const holidateKeySet = useMemo(
    () => buildHolidateKeySet(holidateIsoDates),
    [holidateIsoDates],
  );

  const cheapestProductId = useMemo(() => {
    if (products.length === 0) return null;
    let min = Infinity;
    let id: number | null = null;
    for (const p of products) {
      const v = Number.parseFloat(p.selling_price);
      if (!Number.isFinite(v)) continue;
      if (v < min) {
        min = v;
        id = p.id;
      }
    }
    return id;
  }, [products]);

  const calendar = useMemo(() => {
    const y = viewDate.getFullYear();
    const m = viewDate.getMonth();
    return {
      year: y,
      monthIndex: m,
      cells: buildMonthGrid(y, m),
    };
  }, [viewDate]);

  const monthTitle = useMemo(
    () =>
      new Intl.DateTimeFormat("id-ID", {
        month: "long",
        year: "numeric",
      }).format(viewDate),
    [viewDate],
  );

  const updateCount = (type: "anak" | "dewasa", val: number) => {
    setCounts((prev) => ({ ...prev, [type]: Math.max(0, prev[type] + val) }));
  };

  const goPrevMonth = () => {
    setViewDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  };

  const goNextMonth = () => {
    setViewDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));
  };

  const headcountTotal = counts.anak + counts.dewasa;

  const totalPembayaranRupiah = useMemo(() => {
    if (!visitDetail?.selling_price) return 0;
    const unit = Number.parseFloat(visitDetail.selling_price);
    if (!Number.isFinite(unit)) return 0;
    return Math.round(unit * headcountTotal);
  }, [visitDetail, headcountTotal]);

  const handleLanjutPembayaran = async () => {
    if (!selectedDate || !selectedProduct) {
      setVisitsError("Pilih tanggal kunjungan terlebih dahulu.");
      return;
    }
    if (headcountTotal < 1) {
      setVisitsError("Jumlah pengunjung minimal 1.");
      return;
    }
    setVisitsLoading(true);
    setVisitsError(null);
    try {
      const data = await fetchVisitsClient({
        date: formatDateParamForVisits(selectedDate),
        article: selectedProduct.article,
      });
      setVisitDetail(data);
      setStep(3);
    } catch (e) {
      setVisitsError(
        e instanceof Error ? e.message : "Gagal memuat detail harga.",
      );
    } finally {
      setVisitsLoading(false);
    }
  };

  const handleBayarSekarang = async () => {
    if (!visitDetail || !selectedProduct) return;
    if (!custName.trim() || !custEmail.trim() || !custPhone.trim()) {
      setCheckoutError("Lengkapi nama, email, dan nomor telepon.");
      return;
    }
    if (totalPembayaranRupiah < 1) {
      setCheckoutError("Total pembayaran tidak valid.");
      return;
    }
    const sku = (
      visitDetail.sku ||
      visitDetail.article ||
      selectedProduct.article
    ).trim();
    if (!sku) {
      setCheckoutError("SKU / artikel tidak tersedia.");
      return;
    }
    setCheckoutLoading(true);
    setCheckoutError(null);
    try {
      const out = await fetchCheckoutClient({
        cust_name: custName.trim(),
        email: custEmail.trim(),
        phone: custPhone.trim(),
        sku,
        qty_child: String(counts.anak),
        qty_adult: String(counts.dewasa),
        total_payment: String(totalPembayaranRupiah),
      });
      if (out.redirect_url) {
        window.location.assign(out.redirect_url);
        return;
      }
      setCheckoutError("Tidak ada alamat pembayaran.");
    } catch (e) {
      setCheckoutError(
        e instanceof Error ? e.message : "Checkout gagal. Coba lagi.",
      );
    } finally {
      setCheckoutLoading(false);
    }
  };

  return (
    <>
      <main className="relative min-h-screen bg-[#FFFBE6] pt-28 pb-16 overflow-hidden">
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
            src="/assets/vector-1.png"
            alt=""
            width={100}
            height={100}
            className="absolute top-[15%] right-[13%] rotate-180 scale-x-[-1]"
          />
          <Image
            src="/assets/vector-10.png"
            alt=""
            width={150}
            height={150}
            className="absolute top-[19%] right-[8%]"
          />
          <Image
            src="/assets/vector-1.png"
            alt=""
            width={100}
            height={50}
            className="absolute top-[45%] left-[2%]"
          />
          <Image
            src="/assets/vector-17.png"
            alt=""
            width={250}
            height={1125}
            className="absolute bottom-[-3%] right-[5%]"
          />
        </div>

        <section className="relative z-10 max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-5xl font-black text-[#1A2E44] mb-4">
              {step === 1
                ? c.title
                : step === 3
                  ? "Pembayaran"
                  : checkout.title}
            </h1>
            {step === 1 ? (
              <div
                className="text-slate-500 max-w-xl mx-auto font-medium leading-relaxed [&_p]:mb-0"
                dangerouslySetInnerHTML={{ __html: c.description }}
              />
            ) : step === 3 ? (
              <p className="text-slate-500 max-w-xl mx-auto font-medium leading-relaxed">
                Periksa ringkasan, isi data kontak, lalu lanjut ke pembayaran
                lewat payment gateway.
              </p>
            ) : (
              <div
                className="text-slate-500 max-w-xl mx-auto font-medium leading-relaxed [&_p]:mb-0"
                dangerouslySetInnerHTML={{ __html: checkout.description }}
              />
            )}
          </div>

          <div className="flex justify-center mb-16">
            <div className="bg-white/80 backdrop-blur rounded-full px-8 py-3 shadow-sm border border-yellow-100 flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${step >= 1 ? "bg-[#E5007E] text-white" : "bg-slate-200 text-slate-500"}`}
                >
                  {step > 1 ? <Check size={14} /> : "1"}
                </span>
                <span
                  className={`hidden sm:inline text-sm font-bold ${step >= 1 ? "text-[#E5007E]" : "text-slate-400"}`}
                >
                  {c.steps.step1Label}
                </span>
              </div>
              <div
                className={`h-[2px] w-12 ${step >= 2 ? "bg-[#E5007E]" : "bg-slate-200"}`}
              />
              <div className="flex items-center gap-2">
                <span
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${step >= 2 ? "bg-[#E5007E] text-white" : "bg-slate-200 text-slate-500"}`}
                >
                  {step > 2 ? <Check size={14} /> : "2"}
                </span>
                <span
                  className={`hidden sm:inline text-sm font-bold max-w-32 truncate sm:max-w-none ${step >= 2 ? "text-[#E5007E]" : "text-slate-400"}`}
                >
                  {c.steps.step2Label}
                </span>
              </div>
              <div
                className={`h-[2px] w-12 ${step >= 3 ? "bg-[#E5007E]" : "bg-slate-200"}`}
              />
              <div className="flex items-center gap-2">
                <span
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${step === 3 ? "bg-[#E5007E] text-white" : "bg-slate-200 text-slate-500"}`}
                >
                  3
                </span>
                <span
                  className={`hidden sm:inline text-sm font-bold ${step === 3 ? "text-[#E5007E]" : "text-slate-400"}`}
                >
                  {c.steps.step3Label}
                </span>
              </div>
            </div>
          </div>

          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              {productsError ? (
                <div
                  className="max-w-2xl mx-auto mb-10 rounded-2xl border border-red-100 bg-red-50/90 px-5 py-4 text-center text-sm font-medium text-red-800"
                  role="alert"
                >
                  {productsError}
                </div>
              ) : null}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20">
                {products.length === 0 && !productsError ? (
                  <div className="col-span-full text-center py-12 text-slate-500 font-medium">
                    Belum ada tiket yang tersedia saat ini.
                  </div>
                ) : null}

                {products.map((p) => {
                      const accent = ticketingAccent(p.article_color);
                      const isCheapest = cheapestProductId === p.id;
                      const priceLabel = formatSellingPriceIdr(p.selling_price);

                      return (
                        <div
                          key={p.id}
                          className={`relative bg-white rounded-playful p-8 shadow-xl border border-slate-50 flex flex-col ${isCheapest ? "ring-4 ring-[#E5007E]/10" : ""}`}
                        >
                          {isCheapest && products.length > 1 ? (
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#E5007E] text-white text-[10px] font-black px-5 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                              {c.cheapestPriceLabel}
                            </div>
                          ) : null}
                          <div
                            className={`w-14 h-14 rounded-2xl mb-6 flex items-center justify-center shadow-inner ${accent.iconBg}`}
                          >
                            <Clock
                              className={accent.text}
                              size={28}
                              strokeWidth={2.25}
                              aria-hidden
                            />
                          </div>
                          <h3 className="text-xl font-black text-[#1A2E44] mb-1">
                            {p.article_desc || `Tiket #${p.id}`}
                          </h3>
                          <div className="mb-8">
                            <span
                              className={`text-2xl font-black ${accent.text}`}
                            >
                              Rp {priceLabel}
                            </span>
                            <span className="text-slate-400 text-sm font-medium block mt-1">
                              Harga jual
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedProduct(p);
                              setStep(2);
                            }}
                            className={`mt-auto w-full py-3.5 rounded-full font-bold transition-all ${isCheapest ? "bg-[#E5007E] text-white shadow-lg hover:brightness-110" : "bg-slate-50 text-slate-600 hover:bg-slate-100"}`}
                          >
                            {c.chooseTicketLabel}
                          </button>
                        </div>
                      );
                })}
              </div>

              <div className="max-w-3xl mx-auto bg-white/60 backdrop-blur rounded-playful p-8 md:p-12 shadow-sm border border-yellow-100">
                <h2 className="text-2xl font-black text-[#1A2E44] text-center mb-8">
                  {c.fnq.title}
                </h2>
                <div className="space-y-4">
                  {c.fnq.items.map((faq, i) => (
                    <details
                      key={`${faq.question}-${i}`}
                      className="group border-b border-slate-100 last:border-0 pb-4"
                    >
                      <summary className="flex items-center justify-between cursor-pointer font-bold text-[#1A2E44] list-none">
                        {faq.question}
                        <ChevronRight
                          size={18}
                          className="group-open:rotate-90 transition-transform text-slate-400 shrink-0 ml-2"
                        />
                      </summary>
                      {looksLikeHtml(faq.answer) ? (
                        <div
                          className="mt-3 text-sm text-slate-500 leading-relaxed [&_p]:mb-2"
                          dangerouslySetInnerHTML={{ __html: faq.answer }}
                        />
                      ) : (
                        <p className="mt-3 text-sm text-slate-500 leading-relaxed">
                          {faq.answer}
                        </p>
                      )}
                    </details>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto">
              <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-2xl border border-slate-100">
                {selectedProduct ? (
                  <div className="mb-8 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-pink-100 bg-linear-to-r from-pink-50/90 to-white px-5 py-4">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-pink-600/80">
                        Tiket terpilih
                      </p>
                      <p className="text-lg font-black text-[#1A2E44]">
                        {selectedProduct.article_desc}
                      </p>
                      <p className="text-xs text-slate-500 font-medium">
                        {selectedProduct.article}
                      </p>
                    </div>
                    <p className="text-xl font-black text-[#E5007E] tabular-nums">
                      Rp {formatSellingPriceIdr(selectedProduct.selling_price)}
                    </p>
                  </div>
                ) : null}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  <div>
                    {f.ticketInformation ? (
                      looksLikeHtml(f.ticketInformation) ? (
                        <div
                          className="mb-4 rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-3 text-xs text-slate-600 font-medium leading-relaxed [&_p]:mb-1"
                          dangerouslySetInnerHTML={{
                            __html: f.ticketInformation,
                          }}
                        />
                      ) : (
                        <p className="mb-4 rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-3 text-xs text-slate-600 font-medium leading-relaxed">
                          {f.ticketInformation}
                        </p>
                      )
                    ) : null}
                    <div className="flex items-center gap-2 mb-6">
                      <CalendarIcon className="text-cyan-500" size={20} />
                      <h3 className="text-xl font-black text-[#1A2E44]">
                        {f.chooseDateLabel}
                      </h3>
                    </div>
                    <div className="border border-slate-100 rounded-3xl p-6">
                      <div className="flex items-center justify-between mb-6 px-2">
                        <span className="font-black text-[#1A2E44] capitalize">
                          {monthTitle}
                        </span>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={goPrevMonth}
                            className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-400"
                            aria-label="Bulan sebelumnya"
                          >
                            <ChevronLeft size={20} />
                          </button>
                          <button
                            type="button"
                            onClick={goNextMonth}
                            className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-400"
                            aria-label="Bulan berikutnya"
                          >
                            <ChevronRight size={20} />
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-400 uppercase tracking-tighter mb-4">
                        {["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"].map(
                          (d) => (
                            <div key={d}>{d}</div>
                          ),
                        )}
                      </div>
                      <div className="grid grid-cols-7 gap-1">
                        {calendar.cells.map((day, idx) => {
                          if (day === null) {
                            return (
                              <div
                                key={`empty-${idx}`}
                                className="aspect-square"
                                aria-hidden
                              />
                            );
                          }
                          const cellDate = new Date(
                            calendar.year,
                            calendar.monthIndex,
                            day,
                            12,
                            0,
                            0,
                          );
                          const dayStart = startOfLocalDay(cellDate);
                          const todayStart = startOfLocalDay(new Date());
                          const isPast = dayStart < todayStart;
                          const isSelected =
                            selectedDate != null &&
                            sameLocalDay(selectedDate, cellDate);
                          const isToday =
                            dayStart.getTime() === todayStart.getTime();
                          const cellKey = localDateKeyFromCalendarParts(
                            calendar.year,
                            calendar.monthIndex,
                            day,
                          );
                          const isHolidate = holidateKeySet.has(cellKey);

                          if (isPast) {
                            return (
                              <span
                                key={`${calendar.year}-${calendar.monthIndex}-${day}`}
                                className="aspect-square flex items-center justify-center rounded-full text-sm font-bold text-slate-300 opacity-40 cursor-not-allowed select-none"
                                aria-disabled="true"
                              >
                                {day}
                              </span>
                            );
                          }

                          return (
                            <button
                              key={`${calendar.year}-${calendar.monthIndex}-${day}`}
                              type="button"
                              onClick={() => setSelectedDate(cellDate)}
                              aria-pressed={isSelected}
                              title={
                                isHolidate
                                  ? "Hari khusus — harga dapat berbeda"
                                  : undefined
                              }
                              className={[
                                "relative aspect-square flex items-center justify-center rounded-full text-sm font-bold transition-colors",
                                isSelected
                                  ? "bg-[#E5007E] text-white shadow-lg"
                                  : isHolidate
                                    ? "bg-amber-50 text-amber-950 ring-2 ring-amber-400/80 hover:bg-amber-100/90"
                                    : "text-[#1A2E44] hover:bg-pink-50",
                                isToday && !isSelected
                                  ? isHolidate
                                    ? "ring-2 ring-[#E5007E] ring-offset-1 ring-offset-amber-50"
                                    : "ring-2 ring-[#E5007E]/40 ring-offset-1"
                                  : "",
                              ]
                                .filter(Boolean)
                                .join(" ")}
                            >
                              {day}
                              {isHolidate && !isSelected ? (
                                <span
                                  className="pointer-events-none absolute bottom-1.5 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-amber-500 shadow-sm"
                                  aria-hidden
                                />
                              ) : null}
                            </button>
                          );
                        })}
                      </div>
                      {holidateKeySet.size > 0 ? (
                        <p className="mt-4 text-[10px] text-amber-900/80 font-medium leading-snug flex items-start gap-2">
                          <span
                            className="mt-0.5 inline-flex h-2.5 w-2.5 shrink-0 rounded-full bg-amber-400 ring-2 ring-amber-200"
                            aria-hidden
                          />
                          <span>
                            Tanggal ber-tanda: hari khusus (bisa hari libur
                            nasional atau{" "}
                            <span className="font-bold">tarif berbeda</span>).
                            Pilih tanggal untuk melanjutkan.
                          </span>
                        </p>
                      ) : null}
                    </div>
                    <div className="mt-4 p-4 bg-yellow-50 rounded-2xl border border-yellow-100 flex gap-3 items-start">
                      <span className="text-lg" aria-hidden>
                        ⚠️
                      </span>
                      <div
                        className="text-[11px] text-yellow-800 font-medium leading-relaxed min-w-0 [&_p]:mb-0"
                        dangerouslySetInnerHTML={{
                          __html: f.dateInformation,
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 mb-6">
                      <Users className="text-yellow-500" size={20} />
                      <h3 className="text-xl font-black text-[#1A2E44]">
                        {f.totalVisitorsLabel}
                      </h3>
                    </div>
                    <div className="space-y-4 grow">
                      {visitorRows.map((item) => (
                        <div
                          key={item.key}
                          className="flex items-center justify-between p-6 bg-slate-50 rounded-4xl border border-slate-100"
                        >
                          <div>
                            <p className="font-black text-[#1A2E44]">
                              {item.label}
                            </p>
                            <p className="text-xs text-slate-400 font-medium">
                              {item.sub}
                            </p>
                          </div>
                          <div className="flex items-center gap-4 bg-white rounded-full px-2 py-2 shadow-sm border border-slate-100">
                            <button
                              type="button"
                              onClick={() => updateCount(item.key, -1)}
                              className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-50 text-slate-400 hover:text-pink-500"
                            >
                              <Minus size={16} />
                            </button>
                            <span className="w-6 text-center font-black text-lg">
                              {counts[item.key]}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateCount(item.key, 1)}
                              className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-50 text-slate-400 hover:text-pink-500"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    {visitsError ? (
                      <div
                        className="mt-4 rounded-2xl border border-red-100 bg-red-50/90 px-4 py-3 text-sm font-medium text-red-800"
                        role="alert"
                      >
                        {visitsError}
                      </div>
                    ) : null}
                    <div className="mt-8 flex gap-4">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="flex-1 py-4 rounded-full font-black text-slate-400 border-2 border-slate-100 hover:bg-slate-50 flex items-center justify-center gap-2"
                      >
                        <ChevronLeft size={20} /> {f.buttonBackLabel}
                      </button>
                      <button
                        type="button"
                        onClick={handleLanjutPembayaran}
                        disabled={
                          !selectedDate ||
                          visitsLoading ||
                          headcountTotal < 1
                        }
                        className="flex-2 py-4 rounded-full font-black text-white bg-[#E5007E] shadow-xl shadow-pink-200 hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {visitsLoading ? "Memuat…" : f.buttonSubmitLabel}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && visitDetail && selectedProduct && selectedDate ? (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl mx-auto">
              <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-2xl border border-slate-100">
                <div className="flex items-center gap-2 mb-8">
                  <CreditCard className="text-pink-500" size={22} />
                  <h2 className="text-xl font-black text-[#1A2E44]">
                    {c.steps.step3Label}
                  </h2>
                </div>

                <div className="mb-8 rounded-2xl border border-slate-100 bg-slate-50/80 p-5 space-y-2 text-sm">
                  <p className="text-slate-500 font-medium">
                    <span className="text-slate-800 font-bold">
                      {visitDetail.product_name || visitDetail.description}
                    </span>
                  </p>
                  {visitDetail.description &&
                  visitDetail.description !== visitDetail.product_name ? (
                    <p className="text-slate-600">{visitDetail.description}</p>
                  ) : null}
                  <p className="text-slate-500">
                    Tanggal:{" "}
                    <span className="font-bold text-[#1A2E44]">
                      {formatIdDateLong(selectedDate)}
                    </span>
                  </p>
                  <p className="text-slate-500">
                    Pengunjung:{" "}
                    <span className="font-bold text-[#1A2E44]">
                      {headcountTotal} (anak {counts.anak}, dewasa {counts.dewasa})
                    </span>
                  </p>
                  <div className="pt-2 border-t border-slate-200/80 flex flex-wrap justify-between gap-2 text-[#1A2E44]">
                    <span>
                      {formatSellingPriceIdr(visitDetail.selling_price)} ×{" "}
                      {headcountTotal}
                    </span>
                    <span className="font-black text-lg text-[#E5007E] tabular-nums">
                      Rp {formatSellingPriceIdr(String(totalPembayaranRupiah))}
                    </span>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <div>
                    <label
                      className="block text-xs font-bold text-slate-500 mb-1.5"
                      htmlFor="tiket-cust-name"
                    >
                      Nama lengkap
                    </label>
                    <input
                      id="tiket-cust-name"
                      type="text"
                      autoComplete="name"
                      value={custName}
                      onChange={(e) => setCustName(e.target.value)}
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-[#1A2E44] focus:outline-none focus:ring-2 focus:ring-pink-200"
                      placeholder="Nama sesuai KTP / kartu"
                    />
                  </div>
                  <div>
                    <label
                      className="block text-xs font-bold text-slate-500 mb-1.5"
                      htmlFor="tiket-cust-email"
                    >
                      Email
                    </label>
                    <input
                      id="tiket-cust-email"
                      type="email"
                      autoComplete="email"
                      value={custEmail}
                      onChange={(e) => setCustEmail(e.target.value)}
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-[#1A2E44] focus:outline-none focus:ring-2 focus:ring-pink-200"
                      placeholder="nama@email.com"
                    />
                  </div>
                  <div>
                    <label
                      className="block text-xs font-bold text-slate-500 mb-1.5"
                      htmlFor="tiket-cust-phone"
                    >
                      No. telepon
                    </label>
                    <input
                      id="tiket-cust-phone"
                      type="tel"
                      autoComplete="tel"
                      value={custPhone}
                      onChange={(e) => setCustPhone(e.target.value)}
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-[#1A2E44] focus:outline-none focus:ring-2 focus:ring-pink-200"
                      placeholder="08..."
                    />
                  </div>
                </div>

                {checkoutError ? (
                  <div
                    className="mb-6 rounded-2xl border border-red-100 bg-red-50/90 px-4 py-3 text-sm font-medium text-red-800"
                    role="alert"
                  >
                    {checkoutError}
                  </div>
                ) : null}

                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="sm:flex-1 py-4 rounded-full font-black text-slate-400 border-2 border-slate-100 hover:bg-slate-50 flex items-center justify-center gap-2"
                  >
                    <ChevronLeft size={20} /> Kembali
                  </button>
                  <button
                    type="button"
                    onClick={handleBayarSekarang}
                    disabled={checkoutLoading}
                    className="sm:flex-[2] py-4 rounded-full font-black text-white bg-[#E5007E] shadow-xl shadow-pink-200 hover:brightness-110 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {checkoutLoading ? "Memproses…" : "Bayar sekarang"}
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </section>
      </main>
    </>
  );
}
