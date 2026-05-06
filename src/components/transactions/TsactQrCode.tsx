"use client";

import { QRCodeSVG } from "qrcode.react";

type TsactQrCodeProps = {
  /** Mis. `TSACT-…` dari backend */
  value: string;
  className?: string;
};

/**
 * QR code untuk nomor referensi transaksi / booking (`tsact_doc`).
 */
export default function TsactQrCode({
  value,
  className = "",
}: TsactQrCodeProps) {
  const trimmed = value.trim();
  if (!trimmed) return null;

  return (
    <div
      className={`flex flex-col items-center gap-3 rounded-xl bg-white px-3 py-4 ${className}`.trim()}
      aria-label={`QR code nomor referensi ${trimmed}`}
    >
      <QRCodeSVG
        value={trimmed}
        size={150}
        level="M"
        fgColor="#1a1a2e"
        bgColor="#ffffff"
      />
     
    </div>
  );
}
