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
    <html lang="en" suppressHydrationWarning className={`${inter.variable} h-full scroll-smooth`}>
      <head><script dangerouslySetInnerHTML={{ __html: `(function(){try{var t=localStorage.getItem('weestox-theme');var d=t==='dark'||(t!=='light'&&matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.dataset.theme=d?'dark':'light';document.documentElement.classList.toggle('dark',d)}catch(e){}})();` }} /></head>
      <body className="min-h-full flex flex-col bg-canvas text-body antialiased selection:bg-sky-500/20 selection:text-accent">
        <a className="skip-link" href="#main-content">Skip to content</a>
        <Navigation />
        <main id="main-content" className="flex-1 pt-[76px]">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
