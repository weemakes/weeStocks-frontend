import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";

import JsonLd from "@/components/seo/JsonLd";
import ResearchEvents from "@/components/seo/ResearchEvents";
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
    default: "WeeStox — Stocks, IPO Updates & Metal Prices",
    template: "%s | WeeStox",
  },
  description:
    "Research stocks and financial ratios, track IPO GMP, subscription and allotment updates, and compare gold, silver and platinum rates across Indian cities.",
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
    title: "WeeStox — Stocks, IPO Updates & Metal Prices",
    description:
      "Explore stock financials, IPO GMP, subscription and allotment updates, metal rates, and investment research tools.",
    url: SITE_URL,
    siteName: "WeeStox",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: `${SITE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "WeeStox - Ethical & Shariah Financial Intelligence",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WeeStox — Stocks, IPO Updates & Metal Prices",
    description:
      "Explore stock financials, IPO updates, and gold and silver rates across Indian cities.",
    creator: "@weestox",
    site: "@weestox",
    images: [`${SITE_URL}/og-image.png`],
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
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID || "G-X5PNLX4ZVQ"}`}
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${process.env.NEXT_PUBLIC_GA_ID || "G-X5PNLX4ZVQ"}', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-canvas text-body antialiased selection:bg-sky-500/20 selection:text-accent">
        <JsonLd data={[getOrganizationSchema(), getWebSiteSchema()]} />
        <ResearchEvents />
        <Navigation />
        <main id="main-content" className="flex-1 pt-[98px] sm:pt-[106px]">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
