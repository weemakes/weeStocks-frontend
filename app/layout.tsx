import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "WeeStox | Shariah & Ethical Stock Screener, Live Metals & IPO GMP",
  description: "Institutional-grade financial intelligence for Shariah-compliant equities, live gold/silver rates across Indian cities, real-time IPO GMP, and Islamic wealth tools.",
  keywords: "halal stock screener, shariah compliant stocks india, nse bse halal stocks, gold rate today, ipo gmp, zakat calculator",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} h-full dark`}>
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-300 antialiased selection:bg-sky-500/20 selection:text-sky-300">
        <Navigation />
        <main className="flex-1 pt-[84px] md:pt-[88px]">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
