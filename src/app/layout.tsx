import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/components/providers/Providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Cine Repara - Găsește instalatori de încredere în România",
    template: "%s | Cine Repara",
  },
  description:
    "Cine Repara vă conectează cu instalatori profesioniști verificați pentru toate nevoile dumneavoastră de instalare și reparații. Instalatori termici, electricieni, instalatori HVAC și meșteri universali în toată România.",
  keywords: [
    "instalatori",
    "instalator termic",
    "electrician",
    "instalator HVAC",
    "meșter universal",
    "România",
    "recenzii",
    "servicii instalare",
  ],
  authors: [{ name: "Cine Repara" }],
  openGraph: {
    type: "website",
    locale: "ro_RO",
    url: "https://cinerepara.ro",
    siteName: "Cine Repara",
    title: "Cine Repara - Găsește instalatori de încredere în România",
    description:
      "Conectează-te cu instalatori profesioniști verificați pentru toate nevoile tale de instalare și reparații.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ro">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
