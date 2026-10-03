import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";

import JsonLd from "@/components/seo/JsonLd";
import { getOrganizationSchema, getWebSiteSchema } from "@/components/seo/siteSchemas";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://weestox.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "WeeStox | Shariah & Ethical Stock Screener, Live Metals & IPO GMP",
    template: "%s | WeeStox",
  },
  description:
    "Institutional-grade financial intelligence for AAOIFI Shariah-compliant equities, live gold & silver rates across Indian cities, real-time IPO GMP, and Islamic wealth tools.",
  keywords: [
    "halal stock screener",
    "shariah compliant stocks india",
    "nse bse halal stocks",
    "gold rate today",
    "silver price india",
    "ipo gmp today",
    "live ipo subscription",
    "zakat calculator",
    "aaoifi standard 21",
    "halal investing india",
  ],
  authors: [{ name: "WeeStox Financial Research", url: SITE_URL }],
  creator: "WeeStox",
  publisher: "WeeStox",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "WeeStox | Shariah & Ethical Stock Screener, Live Metals & IPO GMP",
    description:
      "Research NSE/BSE equities for Shariah compliance, debt-to-market-cap leverage, and dividend purification. Monitor real-time Gold rates, IPO GMP, and Zakat.",
    url: SITE_URL,
    siteName: "WeeStox",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "WeeStox | Shariah & Ethical Stock Screener, Live Metals & IPO GMP",
    description:
      "Research NSE/BSE equities for Shariah compliance, debt leverage, live Gold/Silver city rates, and IPO GMP.",
    creator: "@weestox",
    site: "@weestox",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning className={`${inter.variable} h-full scroll-smooth`}>
      <head>
        <Script id="theme-init" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: `(function(){try{var t=localStorage.getItem('weestox-theme');var d=t==='dark'||(t!=='light'&&matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.dataset.theme=d?'dark':'light';document.documentElement.classList.toggle('dark',d)}catch(e){}})();` }} />
      </head>
      <body className="min-h-full flex flex-col bg-canvas text-body antialiased selection:bg-sky-500/20 selection:text-accent">
        <JsonLd data={[getOrganizationSchema(), getWebSiteSchema()]} />
        <a className="skip-link" href="#main-content">Skip to content</a>
        <Navigation />
        <main id="main-content" className="flex-1 pt-[88px] sm:pt-[92px] lg:pt-[84px]">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
