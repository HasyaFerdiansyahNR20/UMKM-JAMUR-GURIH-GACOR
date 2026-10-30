import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AppShell } from "@/components/AppShell";

export const metadata: Metadata = {
  title: "UMKM Gurih Gacor — Kriuk-Kriuk Nya Bikin Ngiler!",
  description:
    "Website Resmi Katalog Kuliner UMKM Gurih Gacor. Sajian jamur crispy gurih, ayam geprek sambal ulek, dan paket hemat renyah dengan alur Direct WhatsApp Order cepat dan praktis.",
  keywords: [
    "UMKM Gurih Gacor",
    "Jamur Crispy",
    "Ayam Geprek",
    "Kulit Crispy",
    "Kuliner Cepat Saji",
    "Katalog Makanan WhatsApp",
    "Kriuk-Kriuk Nya Bikin Ngiler",
  ],
  authors: [{ name: "UMKM Gurih Gacor" }],
  openGraph: {
    title: "UMKM Gurih Gacor — Kriuk-Kriuk Nya Bikin Ngiler!",
    description: "Katalog menu jamur crispy & ayam geprek gurih renyah nusantara. Pesan langsung via WhatsApp!",
    type: "website",
    locale: "id_ID",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="scroll-smooth">
      <body className="min-h-screen flex flex-col justify-between">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
