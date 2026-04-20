"use client";

import Cookies from "js-cookie";
import { Check, ChevronDown, Globe2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import type { Lang } from "@/types/lang";

const COOKIE_KEY = "lang";
const COOKIE_MAX_AGE_DAYS = 365;

const OPTIONS: {
  code: Lang;
  label: string;
  native: string;
  stripe: string; // Tailwind gradient for mini flag hint
}[] = [
  {
    code: "id",
    label: "Indonesia",
    native: "Bahasa Indonesia",
    stripe: "from-[#E11D2E] via-white to-[#E11D2E]",
  },
  {
    code: "en",
    label: "English",
    native: "English",
    stripe: "from-[#012169] via-white to-[#C8102E]",
  },
];

type LanguageSwitcherProps = {
  variant: "desktop" | "mobile";
  /** Called before reload (e.g. close mobile overlay). */
  onBeforeNavigate?: () => void;
};

export default function LanguageSwitcher({
  variant,
  onBeforeNavigate,
}: LanguageSwitcherProps) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Lang>("id");
  const initialized = useRef(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    const saved = Cookies.get(COOKIE_KEY);
    if (saved === "en" || saved === "id") {
      if (saved !== "id") {
        requestAnimationFrame(() => setSelected(saved));
      }
    } else {
      Cookies.set(COOKIE_KEY, "id", { expires: COOKIE_MAX_AGE_DAYS });
    }
  }, []);

  useEffect(() => {
    function onPointerDown(e: MouseEvent) {
      if (
        rootRef.current &&
        !rootRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  const applyLang = useCallback(
    (code: Lang) => (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      Cookies.set(COOKIE_KEY, code, { expires: COOKIE_MAX_AGE_DAYS });
      setSelected(code);
      setOpen(false);
      onBeforeNavigate?.();
      window.setTimeout(() => {
        window.location.reload();
      }, 80);
    },
    [onBeforeNavigate],
  );

  const current = OPTIONS.find((o) => o.code === selected) ?? OPTIONS[0];

  if (variant === "mobile") {
    return (
      <div className="w-full max-w-sm mx-auto px-2">
        <p className="text-center text-xs font-black uppercase tracking-[0.2em] text-[#1A2E44]/55 mb-3">
          Pilih bahasa
        </p>
        <div
          className="grid grid-cols-2 gap-2 p-1.5 rounded-full bg-white/55 backdrop-blur-md border border-white/50 shadow-inner shadow-white/40"
          role="group"
          aria-label="Pilih bahasa"
        >
          {OPTIONS.map((opt) => {
            const active = selected === opt.code;
            return (
              <button
                key={opt.code}
                type="button"
                onClick={applyLang(opt.code)}
                className={[
                  "relative flex flex-col items-center justify-center gap-1 rounded-full py-3.5 px-3 text-center transition-all duration-300",
                  active
                    ? "bg-gradient-to-br from-[#E5007E] to-[#FF4DB8] text-white shadow-[0_8px_24px_-6px_rgba(229,0,126,0.55)] scale-[1.02]"
                    : "text-[#1A2E44] hover:bg-white/70 active:scale-[0.98]",
                ].join(" ")}
              >
                <span
                  className={[
                    "h-1 w-10 rounded-full bg-gradient-to-r shadow-sm",
                    opt.stripe,
                    active ? "opacity-90" : "opacity-80",
                  ].join(" ")}
                  aria-hidden
                />
                <span className="text-[11px] font-black uppercase tracking-wider">
                  {opt.code}
                </span>
                <span
                  className={[
                    "text-[10px] font-semibold leading-tight",
                    active ? "text-white/90" : "text-slate-500",
                  ].join(" ")}
                >
                  {opt.native}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  /* desktop */
  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="group flex items-center gap-2 rounded-full border border-white/60 bg-white/65 px-3.5 py-2 shadow-sm backdrop-blur-md transition-all hover:border-[#B9E9FF] hover:bg-white/90 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E5007E]/40"
      >
        <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#B9E9FF] to-[#FFE0F0] text-[#1A2E44] shadow-inner">
          <Globe2
            size={16}
            strokeWidth={2.25}
            className="transition-transform group-hover:rotate-12"
            aria-hidden
          />
        </span>
        <span className="hidden min-[900px]:inline text-xs font-black uppercase tracking-wider text-[#1A2E44]">
          {current.code}
        </span>
        <ChevronDown
          size={16}
          className={`text-[#1A2E44]/70 transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>

      {open ? (
        <div
          className="absolute right-0 top-[calc(100%+10px)] z-[70] w-[min(100vw-2rem,260px)] origin-top-right animate-in fade-in zoom-in-95 duration-200"
          role="listbox"
          aria-label="Bahasa"
        >
          <div className="rounded-2xl border border-[#B9E9FF]/70 bg-white/95 p-1.5 shadow-xl shadow-[#1A2E44]/12 backdrop-blur-xl">
            <div className="pointer-events-none px-3 pt-2 pb-1">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#1A2E44]/45">
                Bahasa / Language
              </p>
            </div>
            {OPTIONS.map((opt) => {
              const active = selected === opt.code;
              return (
                <button
                  key={opt.code}
                  type="button"
                  role="option"
                  aria-selected={active}
                  className={[
                    "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors",
                    active
                      ? "bg-gradient-to-r from-[#FFF5FB] to-[#F0F9FF] ring-1 ring-[#E5007E]/15"
                      : "hover:bg-slate-50/90",
                  ].join(" ")}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onClick={applyLang(opt.code)}
                >
                  <span
                    className={[
                      "h-8 w-8 shrink-0 rounded-lg bg-gradient-to-br shadow-inner ring-1 ring-black/5",
                      opt.stripe,
                    ].join(" ")}
                    aria-hidden
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-black text-[#1A2E44]">
                      {opt.native}
                    </span>
                    <span className="block text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                      {opt.label}
                    </span>
                  </span>
                  {active ? (
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#E5007E] text-white shadow-md shadow-pink-300/50">
                      <Check size={14} strokeWidth={3} aria-hidden />
                    </span>
                  ) : (
                    <span className="h-7 w-7 shrink-0 rounded-full border border-dashed border-slate-200" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
