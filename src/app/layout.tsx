import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AppShell } from "@/components/AppShell";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://jamurgurihgacor.store"),
  title: "UMKM Gurih Gacor — Kriuk-Kriuk Nya Bikin Ngiler!",
  description:
    "Website Resmi Katalog Kuliner UMKM Gurih Gacor. Sajian jamur tiram crispy gurih renyah bumbu 7 rempah Nusantara dalam varian Original, Pedas, Manis, dan Pedas Manis.",
  keywords: [
    "UMKM Gurih Gacor",
    "Jamur Crispy",
    "Jamur Tiram Crispy",
    "Camilan Jamur Renyah",
    "Kuliner Nusantara",
    "Katalog Makanan WhatsApp",
    "Kriuk-Kriuk Nya Bikin Ngiler",
  ],
  authors: [{ name: "UMKM Gurih Gacor" }],
  icons: {
    icon: "/logo-gurih-gacor.webp",
    apple: "/logo-gurih-gacor.webp",
  },
  openGraph: {
    title: "UMKM Gurih Gacor — Kriuk-Kriuk Nya Bikin Ngiler!",
    description: "Katalog menu jamur tiram crispy gurih renyah Nusantara mulai 5 ribuan. Pesan langsung via WhatsApp atau Telegram!",
    type: "website",
    locale: "id_ID",
    images: [
      {
        url: "/logo-gurih-gacor.webp",
        width: 800,
        height: 800,
        alt: "UMKM Gurih Gacor — Jamur Tiram Crispy Nusantara",
      },
    ],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#f59e0b",
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
