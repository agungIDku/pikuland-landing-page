"use client";

import type { MenuItem, MenuNavCta } from "@/types/menuContent";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { X, Menu } from "lucide-react";

type NavbarProps = {
  menu?: MenuItem[];
  navCta?: MenuNavCta;
  /** CMS logo URL; falls back to `/assets/logo-pikuland.png` when omitted. */
  logoUrl?: string;
};

const STATIC_LOGO = "/assets/logo-pikuland.png";

export default function Navbar({ menu, navCta, logoUrl }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = menu && menu.length > 0 ? menu : [];
  const cta = navCta ?? { href: "/tiket", label: "Beli Tiket" };
  const logoSrc = logoUrl?.trim() || STATIC_LOGO;

  // Mencegah scroll saat menu mobile terbuka
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [mobileMenuOpen]);

  return (
    <header className="fixed top-0 z-50 w-full">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Desktop & Mobile Header Bar */}
        <div className="mt-3 flex items-center justify-between px-6 py-3 bg-white/50 backdrop-blur-md rounded-full border border-white/20 shadow-sm">
          {/* Logo */}
          <Link href="/" className="shrink-0">
            <Image
              src={logoSrc}
              alt="Pikuland Logo"
              width={60}
              height={40}
              className="h-10 w-auto"
              priority
            />
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link, i) => (
              <Link
                key={`${link.href}-${i}`}
                href={link.href}
                className={`px-4 py-2 text-sm font-bold rounded-full transition-all hover:text-[#E5007E] ${
                  pathname === link.href ? "text-[#E5007E]" : "text-[#1A2E44]"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTA Button */}
          <Link
            href={cta.href}
            className="hidden md:inline-flex items-center gap-2 bg-blue text-white font-bold text-sm px-6 py-2.5 rounded-full hover:bg-[#009CE0] transition-all hover:-translate-y-0.5 shadow-[3px_4px_0px_#007DB3] active:translate-y-1 active:shadow-none"
          >
            {cta.label}
          </Link>

          {/* Mobile menu button (Hamburger) */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden p-2 text-[#1A2E44]"
            aria-label="Open menu"
          >
            <Menu size={28} />
          </button>
        </div>

        {/* FULL SCREEN MOBILE MENU */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-60 bg-[#B9E9FF] md:hidden overflow-hidden animate-in fade-in duration-300">
            {/* Animasi Background Glow - Muncul perlahan */}
            <div className="absolute bottom-[-10%] right-[-10%] w-[300px] h-[300px] bg-[#C1A7E2] rounded-full blur-[80px] opacity-60 animate-in zoom-in duration-1000" />

            <div className="relative h-full flex flex-col px-4">
              {/* 1. Header Pill - Slide down dari atas */}
              <div className="mt-3 flex items-center justify-between px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full shadow-sm animate-in slide-in-from-top-10 duration-500">
                <Image
                  src={logoSrc}
                  alt="Pikuland Logo"
                  width={60}
                  height={40}
                  className="h-10 w-auto"
                />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 bg-slate-100/50 rounded-full text-slate-600 hover:rotate-90 transition-transform duration-300"
                >
                  <X size={24} />
                </button>
              </div>

              {/* 2. Menu Links - Animasi Staggered (Muncul bergantian) */}
              <div className="grow flex flex-col items-center justify-center gap-8 -mt-20">
                {navLinks.map((link, index) => (
                  <Link
                    key={`${link.href}-${index}`}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    style={{ animationDelay: `${index * 100}ms` }} // Jeda antar menu
                    className={`text-4xl font-black transition-all hover:scale-110 active:scale-95 animate-in fade-in slide-in-from-bottom-10 fill-mode-forwards ${
                      pathname === link.href
                        ? "text-[#E5007E]"
                        : "text-[#1A2E44]"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}

                {/* 3. Button - Muncul paling terakhir */}
                <Link
                  href={cta.href}
                  onClick={() => setMobileMenuOpen(false)}
                  style={{ animationDelay: `${navLinks.length * 100}ms` }}
                  className="mt-4 bg-blue text-white font-black text-xl px-12 py-4 rounded-full shadow-[4px_6px_0px_#007DB3] hover:translate-y-1 hover:shadow-none transition-all animate-in fade-in zoom-in duration-500 fill-mode-forwards"
                >
                  {cta.label}
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
