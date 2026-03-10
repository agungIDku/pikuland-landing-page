"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "Beranda" },
  { href: "/galeri", label: "Galeri" },
  { href: "/tiket", label: "Tiket" },
  { href: "/karir", label: "Karir" },
  { href: "/kontak", label: "Kontak" },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="fixed top-0 z-50 w-full">
      {/* Menggunakan fixed agar navbar mengikuti scroll (seperti sticky) namun melayang di atas hero section tanpa memakan / mendorong ruang hero ke bawah */}
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Pembungkus memiliki background transparan (bg-white/75) agar opacity tidak menurun ke anak elemen (seperti tombol) */}
        <div className="mt-3 flex items-center justify-between px-6 py-3 bg-white/50 backdrop-blur-md rounded-full">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/assets/logo-pikuland.png"
              alt="Pikuland Logo"
              width={60}
              height={40}
              className="h-10 w-auto"
              priority
            />
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 text-sm font-bold rounded-full transition-all hover:text-[#E5007E] ${
                  pathname === link.href ? "text-[#E5007E]" : "text-gray-700"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <Link
            href="/tiket"
            className="hidden md:inline-flex items-center gap-2 bg-[#00AEEF] text-white font-bold text-sm px-6 py-2.5 rounded-full hover:bg-[#009CE0] transition-all hover:-translate-y-0.5 shadow-[3px_4px_0px_#007DB3] active:translate-y-1 active:shadow-none"
          >
            Beli Tiket
          </Link>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-700 rounded-lg hover:bg-gray-100"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-2 mx-2 rounded-3xl backdrop-blur-xl shadow-xl border border-white/50 p-4 animate-in fade-in slide-in-from-top-2">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-3 text-sm font-bold rounded-2xl transition-colors hover:text-[#E5007E] ${
                    pathname === link.href ? "text-[#E5007E]" : "text-gray-700"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/tiket"
                onClick={() => setMobileMenuOpen(false)}
                className="mt-2 text-center bg-[#00AEEF] text-white font-bold text-sm px-6 py-3 rounded-full hover:bg-[#009CE0] transition-all hover:-translate-y-0.5 shadow-[3px_4px_0px_#007DB3] active:translate-y-1 active:shadow-none"
              >
                Beli Tiket
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
