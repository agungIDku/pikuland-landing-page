"use client";

import Navbar from "@/components/Navbar";
import type { MenuItem, MenuNavCta } from "@/types/menuContent";
import { usePathname } from "next/navigation";

type ConditionalNavbarProps = {
  menu?: MenuItem[];
  navCta?: MenuNavCta;
  logoUrl?: string;
};

/** Navbar situs disembunyikan di halaman detail transaksi/booking. */
export default function ConditionalNavbar({
  menu,
  navCta,
  logoUrl,
}: ConditionalNavbarProps) {
  const pathname = usePathname();
  if (pathname === "/transactions" || pathname?.startsWith("/transactions/")) {
    return null;
  }
  return <Navbar menu={menu} navCta={navCta} logoUrl={logoUrl} />;
}
