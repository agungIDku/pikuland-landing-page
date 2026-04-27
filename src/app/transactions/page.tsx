import { Suspense } from "react";
import TransactionsClient from "./TransactionsClient";

export const dynamic = "force-dynamic";

export default function TransactionsPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-dvh bg-(--color-cream) px-4 pt-[88px]">
          <p className="text-slate-500 text-sm">Memuat…</p>
        </main>
      }
    >
      <TransactionsClient />
    </Suspense>
  );
}
