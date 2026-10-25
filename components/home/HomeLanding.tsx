'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowRight, BarChart3, Check, ChevronRight,
  Coins, FileSearch, Gem, LineChart, PieChart, Rocket, Search,
  TrendingUp, WalletCards,
} from 'lucide-react';
import type { MarketPulseData } from './MarketPulse';
import ResearchHero from './ResearchHero';
import { AAOIFI_PILLARS, HOME_FAQS, POPULAR_HALAL_SECTORS } from './seoContent';

interface Props {
  data: MarketPulseData;
}

export default function HomeLanding({ data }: Props) {
  const { featuredStock, gold, topIpo, zakatNisab } = data;


  return (
    <div className="overflow-hidden bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      {/* Previous hero, rotation state and helpers are preserved commented out in PreviousHomeLanding.tsx. */}
      <ResearchHero data={data} />

      {/* Products Overview */}
      <section className="bg-slate-50/70 py-14 dark:bg-slate-900/30">
        <div className="container mx-auto">
          <SectionHeading
            eyebrow="Products"
            title="Everything you need to research with confidence."
            copy="Powerful tools for smarter, ethical investing across Indian and global markets."
          />
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <ProductCard
              href="/stocks"
              icon={<TrendingUp />}
              title="Stocks"
              copy="Fundamental, technical and Shariah-compliant stock research."
              items={['Detailed company analysis', 'Technical indicators', 'Shariah compliance screening']}
              preview={`${featuredStock.symbol}  ${featuredStock.price}`}
              tone="sky"
            />
            <ProductCard
              href="/ipo"
              icon={<Rocket />}
              title="IPOs"
              copy="Track upcoming and live IPOs with GMP and subscription insights."
              items={['Live GMP and subscription', 'Key dates and analysis', 'Compare with listed peers']}
              preview={`${topIpo.name}  ${topIpo.gmpDisplay}`}
              tone="rose"
            />
            <ProductCard
              href="/gold"
              icon={<Gem />}
              title="Precious Metals"
              copy="Track gold, silver and platinum with historical prices."
              items={['Live and historical prices', 'Interactive trend charts', 'Price alerts and calculators']}
              preview={`Gold 24K  ${gold.price10g}`}
              tone="amber"
            />
            <ProductCard
              href="/zakat"
              icon={<WalletCards />}
              title="Islamic Wealth"
              copy="Track Zakat, purification and ethical investing."
              items={['Zakat calculator', 'Income purification', 'Screening guidance']}
              preview={`Nisab  ${zakatNisab.silverNisabValue}`}
              tone="emerald"
            />
          </div>
        </div>
      </section>

      {/* Feature Showcases */}
      <section className="py-14">
        <div className="container mx-auto">
          <SectionHeading
            title="Powerful tools, simple experience."
            copy="Designed to make complex research clear, visual and meaningful."
          />
          <div className="mt-9 space-y-10">
            <Showcase
              title="Shariah-compliant stock research"
              copy="Get a complete view of any company with price charts, key ratios, growth trends and Shariah compliance status—all in one place."
              bullets={['Price charts with key indicators', 'Valuation and financial highlights', 'AAOIFI-based compliance checks']}
              href="/stocks"
              cta="Try the Stock Screener"
              preview="stock"
            />
            <Showcase
              title="Track IPOs and precious metals with ease"
              copy="Stay updated on IPO GMP and subscription demand while tracking gold, silver and platinum prices with useful calculators."
              bullets={['Live IPO GMP and subscription', 'IPO dates and company insights', 'Historical metal prices and calculators']}
              href="/ipo"
              cta="Explore IPOs & Metals"
              preview="markets"
              reverse
            />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-gradient-to-r from-sky-50 to-emerald-50 py-10 dark:from-sky-950/20 dark:to-emerald-950/20">
        <div className="container mx-auto">
          <SectionHeading
            title="How WeeStox helps you decide"
            copy="A simple path from discovery to confident, ethical investing."
          />
          <div className="mt-7 grid items-center gap-3 md:grid-cols-[1fr_auto_1fr_auto_1fr]">
            <DecisionFlow number="1" title="Discover opportunities" copy="Find ideas across stocks, IPOs, metals and Islamic wealth tools." type="search" />
            <ArrowRight className="mx-auto hidden h-5 w-5 text-sky-500 md:block" />
            <DecisionFlow number="2" title="Analyse the full picture" copy="Explore charts, ratios, GMP and Shariah compliance in one place." type="analysis" />
            <ArrowRight className="mx-auto hidden h-5 w-5 text-sky-500 md:block" />
            <DecisionFlow number="3" title="Decide with ethical clarity" copy="Use transparent data and methodology aligned with your values." type="decision" />
          </div>
        </div>
      </section>

      {/* AAOIFI Standard 21 & Compliance Criteria */}
      <section className="py-12">
        <div className="container mx-auto">
          <SectionHeading
            title="A platform you can trust"
            copy="Built on ethical standards, transparent methodology and reliable data."
          />

          <div className="mt-8 grid items-center gap-5 lg:grid-cols-[220px_1fr]">
            <div className="flex items-center gap-4">
              <div className="flex h-24 w-24 shrink-0 flex-col items-center justify-center rounded-full border-[8px] border-emerald-500">
                <strong className="text-lg">4/4</strong>
                <span className="text-[9px] text-slate-500">criteria</span>
              </div>
              <div>
                <strong className="text-sm">AAOIFI Standard No. 21</strong>
                <p className="mt-1 text-[10px] leading-4 text-slate-500">
                  Shariah screening based on recognized financial criteria.
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <TrustCard icon={<FileSearch />} title="Transparent calculations" copy="Clear methodology you can verify." />
              <TrustCard icon={<PieChart />} title="Multiple market tools" copy="Stocks, IPOs, metals and Islamic wealth." />
              <TrustCard icon={<BarChart3 />} title="Live and historical data" copy="Reliable context for informed decisions." />
            </div>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {AAOIFI_PILLARS.map((pillar) => (
              <div key={pillar.id} className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between p-4">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className={`rounded border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${pillar.tagColor}`}>
                    {pillar.badge}
                  </span>
                  <span className="text-xs font-black tabular-nums text-slate-900 dark:text-white">
                    {pillar.threshold}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{pillar.title}</h4>
                <p className="mt-1.5 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 sm:p-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-sky-600">NSE & BSE Shariah Sectors</span>
                <h3 className="text-base font-black sm:text-lg">Key Halal Investment Sectors in India</h3>
              </div>
              <Link href="/stocks" className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-600 hover:text-sky-700">
                Open Full Screener <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {POPULAR_HALAL_SECTORS.map((sector) => (
                <div key={sector.name} className="rounded-xl border border-slate-100 bg-slate-50/70 p-3.5 dark:border-slate-800 dark:bg-slate-950/40">
                  <div className="flex items-center justify-between">
                    <strong className="text-xs font-bold text-slate-900 dark:text-white">{sector.name}</strong>
                    <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400">{sector.complianceRate}</span>
                  </div>
                  <p className="mt-1 text-[10px] leading-4 text-slate-500 dark:text-slate-400">{sector.note}</p>
                  <span className="mt-2 block truncate text-[9px] font-semibold text-slate-400 dark:text-slate-500">
                    e.g. {sector.examples}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Learning / Articles */}
      <section className="border-y border-slate-200 bg-slate-50/70 py-12 dark:border-slate-800 dark:bg-slate-900/30">
        <div className="container mx-auto">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black">Learn before you invest</h2>
              <p className="mt-1 text-xs text-slate-500">Insights and guides for smarter, more ethical decisions.</p>
            </div>
            <Link href="/about" className="text-xs font-bold text-sky-600">
              View all articles <ArrowRight className="inline h-3 w-3" />
            </Link>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <Article icon={<LineChart />} tag="Stocks" title="Stock analysis basics" copy="Key ratios every investor should understand." />
            <Article icon={<Rocket />} tag="IPOs" title="Understanding IPO GMP" copy="What it means and how to use it wisely." />
            <Article icon={<Coins />} tag="Metals" title="Gold purity and Zakat" copy="A complete beginner’s guide." />
          </div>
        </div>
      </section>

      <ReviewMarquee />

      {/* Comprehensive FAQs Section */}
      <section className="border-y border-slate-200 bg-slate-50/70 py-12 dark:border-slate-800 dark:bg-slate-900/30">
        <div className="container mx-auto max-w-5xl">
          <SectionHeading
            title="Frequently asked questions"
            copy="Comprehensive answers to help you navigate Halal stocks, IPO GMP, bullion rates, and Zakat calculations."
          />
          <div className="mt-7 divide-y divide-slate-200 overflow-hidden rounded-2xl border border-slate-200 bg-white px-5 dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-900">
            {HOME_FAQS.map((faq) => (
              <details key={faq.question} className="group py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-bold">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded bg-sky-100 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-sky-700 dark:bg-sky-950 dark:text-sky-300">
                      {faq.category}
                    </span>
                    <span className="text-slate-900 dark:text-slate-100">{faq.question}</span>
                  </div>
                  <ChevronRight className="h-4 w-4 shrink-0 transition-transform group-open:rotate-90 text-slate-400 group-hover:text-sky-600" />
                </summary>
                <p className="mt-3 max-w-3xl text-xs leading-6 text-slate-600 dark:text-slate-300 pl-1">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="py-12">
        <div className="container mx-auto">
          <div className="flex flex-col items-start justify-between gap-6 rounded-3xl bg-gradient-to-r from-sky-100 to-blue-50 px-7 py-9 dark:from-sky-950 dark:to-slate-900 md:flex-row md:items-center">
            <div>
              <h2 className="text-2xl font-black text-slate-950 dark:text-white">Build wealth with clarity.</h2>
              <p className="mt-2 text-xs text-slate-600 dark:text-slate-300">
                Access stocks, IPOs, metals and Islamic wealth tools in one trusted platform.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/stocks" className="rounded-lg bg-sky-600 px-5 py-3 text-xs font-bold text-white hover:bg-sky-700 transition-colors">
                Launch Stock Screener
              </Link>
              <Link href="/about" className="rounded-lg border border-sky-300 bg-white px-5 py-3 text-xs font-bold text-sky-700 hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-200 transition-colors">
                Explore All Tools
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

const tones = {
  sky: 'bg-sky-100 text-sky-600 dark:bg-sky-950 dark:text-sky-400',
  rose: 'bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400',
  amber: 'bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400',
  emerald: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400',
} as const;

function SectionHeading({ eyebrow, title, copy }: { eyebrow?: string; title: string; copy: string }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      {eyebrow && <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-sky-600">{eyebrow}</span>}
      <h2 className="mt-1 text-2xl font-black tracking-tight sm:text-3xl text-slate-950 dark:text-white">{title}</h2>
      <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">{copy}</p>
    </div>
  );
}

function ProductCard({
  href, icon, title, copy, items, preview, tone,
}: {
  href: string; icon: React.ReactNode; title: string; copy: string; items: string[]; preview: string; tone: keyof typeof tones;
}) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900 flex min-h-80 flex-col p-5">
      <span className={`w-fit rounded-xl p-2.5 ${tones[tone]} [&>svg]:h-5 [&>svg]:w-5`}>{icon}</span>
      <h3 className="mt-4 text-base font-black text-slate-950 dark:text-white">{title}</h3>
      <p className="mt-2 text-[11px] leading-5 text-slate-500 dark:text-slate-400">{copy}</p>
      <ul className="mt-4 space-y-2">
        {items.map((item) => (
          <li key={item} className="flex items-center gap-2 text-[10px] text-slate-700 dark:text-slate-300">
            <Check className="h-3 w-3 text-emerald-500" />
            {item}
          </li>
        ))}
      </ul>
      <div className="mt-auto rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs font-bold dark:border-slate-800 dark:bg-slate-950">
        {preview}
      </div>
      <Link
        href={href}
        className="mt-3 inline-flex items-center justify-center gap-2 rounded-lg bg-sky-600 px-4 py-2.5 text-[10px] font-bold text-white hover:bg-sky-700 transition-colors"
      >
        Explore {title} <ArrowRight className="h-3 w-3" />
      </Link>
    </article>
  );
}

function Showcase({
  title, copy, bullets, href, cta, preview, reverse,
}: {
  title: string; copy: string; bullets: string[]; href: string; cta: string; preview: 'stock' | 'markets'; reverse?: boolean;
}) {
  return (
    <div className={`grid items-center gap-8 lg:grid-cols-2 ${reverse ? 'lg:[&>*:first-child]:order-2' : ''}`}>
      <div>
        <h3 className="text-xl font-black text-slate-950 dark:text-white">{title}</h3>
        <p className="mt-3 max-w-xl text-xs leading-5 text-slate-500 dark:text-slate-400">{copy}</p>
        <ul className="mt-5 space-y-2">
          {bullets.map((item) => (
            <li key={item} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
              <Check className="h-3.5 w-3.5 text-emerald-500" />
              {item}
            </li>
          ))}
        </ul>
        <Link
          href={href}
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-sky-600 px-5 py-3 text-xs font-bold text-white hover:bg-sky-700 transition-colors"
        >
          {cta}
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
      {preview === 'stock' ? <StockPreview /> : <MarketPreview />}
    </div>
  );
}

function StockPreview() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-start justify-between">
        <div>
          <span className="text-[9px] text-slate-400">NSE • IT Services</span>
          <h4 className="font-black text-slate-950 dark:text-white">Tata Consultancy Services</h4>
          <strong className="text-xl text-slate-950 dark:text-white">₹4,124.50</strong>
        </div>
        <span className="rounded-lg bg-emerald-100 px-3 py-2 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
          AAOIFI 21 Compliant
        </span>
      </div>
      <div className="mt-5 grid gap-4 sm:grid-cols-[1.45fr_1fr]">
        <div className="rounded-xl bg-sky-50 p-3 dark:bg-sky-950/30">
          <svg viewBox="0 0 150 56" className="h-14 w-36">
            <path d="M3 49 L18 40 L31 43 L46 27 L59 32 L72 20 L88 25 L101 14 L117 18 L132 8 L147 11" fill="none" stroke="var(--primary-accent)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div className="mt-2 flex justify-between text-[9px] text-slate-500">
            <span>Jan</span>
            <span>Feb</span>
            <span>Mar</span>
            <span>Apr</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <SmallMetric label="P/E" value="19.8" />
          <SmallMetric label="Market cap" value="₹11.9T" />
          <SmallMetric label="ROE" value="16.4%" />
          <SmallMetric label="Growth" value="+14.2%" />
        </div>
      </div>
    </div>
  );
}

function MarketPreview() {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex justify-between text-xs font-black">
          <span>Upcoming IPOs</span>
          <Link href="/ipo" className="text-sky-600 hover:text-sky-700">View all</Link>
        </div>
        {['Tata Technologies', 'Ola Electric', 'Hyundai India'].map((name, index) => (
          <div key={name} className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 text-[10px] dark:border-slate-800">
            <span>{name}</span>
            <b className="text-rose-600">+{12 - index * 4}%</b>
          </div>
        ))}
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between">
          <b className="text-xs">Gold 24K</b>
          <Coins className="h-4 w-4 text-amber-500" />
        </div>
        <strong className="mt-4 block text-xl text-slate-950 dark:text-white">₹73,482</strong>
        <svg viewBox="0 0 150 56" className="h-14 w-36">
          <path d="M3 49 L18 40 L31 43 L46 27 L59 32 L72 20 L88 25 L101 14 L117 18 L132 8 L147 11" fill="none" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <Link href="/gold" className="mt-2 block text-[10px] font-bold text-sky-600 hover:text-sky-700">
          Open metals desk →
        </Link>
      </div>
    </div>
  );
}

function SmallMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-slate-50 p-2 dark:bg-slate-950">
      <span className="block text-[8px] uppercase text-slate-400">{label}</span>
      <b className="text-xs text-slate-900 dark:text-slate-100">{value}</b>
    </div>
  );
}

function DecisionFlow({
  number, title, copy, type,
}: {
  number: string; title: string; copy: string; type: 'search' | 'analysis' | 'decision';
}) {
  return (
    <div>
      <div className="mb-2 flex items-center gap-2">
        <span className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-black text-white ${type === 'decision' ? 'bg-emerald-500' : 'bg-sky-600'}`}>
          {number}
        </span>
        <h3 className="text-xs font-black text-slate-950 dark:text-white">{title}</h3>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-xs dark:border-slate-800 dark:bg-slate-900 h-24">
        {type === 'search' && (
          <>
            <div className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-[8px] text-slate-400 dark:border-slate-700">
              <Search className="h-3 w-3" />
              Search stocks, IPOs or tools...
            </div>
            <div className="mt-2 flex gap-1 text-[7px]">
              <span className="rounded bg-slate-100 px-2 py-1 dark:bg-slate-800">RELIANCE</span>
              <span className="rounded bg-slate-100 px-2 py-1 dark:bg-slate-800">Gold 24K</span>
              <span className="rounded bg-slate-100 px-2 py-1 dark:bg-slate-800">Upcoming IPOs</span>
            </div>
          </>
        )}
        {type === 'analysis' && (
          <>
            <div className="flex gap-4 border-b border-slate-200 pb-1 text-[7px] dark:border-slate-700">
              <b className="text-sky-600">Price</b>
              <span>Financials</span>
              <span>Shariah</span>
              <span>News</span>
            </div>
            <svg viewBox="0 0 220 44" className="mt-1 h-11 w-full">
              <polyline points="2,38 24,32 45,34 66,25 88,28 112,18 133,22 154,11 177,15 218,4" fill="none" stroke="var(--primary-accent)" strokeWidth="2" />
            </svg>
          </>
        )}
        {type === 'decision' && (
          <div className="flex h-full flex-col items-center justify-center">
            <span className="rounded-lg bg-emerald-100 px-4 py-2 text-[9px] font-black text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
              ✓ Shariah Compliant
            </span>
            <span className="mt-2 rounded-md bg-sky-600 px-4 py-1.5 text-[8px] font-bold text-white">
              Add to Watchlist
            </span>
          </div>
        )}
      </div>
      <p className="mt-2 text-[9px] leading-4 text-slate-500 dark:text-slate-400">{copy}</p>
    </div>
  );
}

function TrustCard({ icon, title, copy }: { icon: React.ReactNode; title: string; copy: string }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-slate-200 p-4 dark:border-slate-800">
      <span className="rounded-lg bg-sky-100 p-2 text-sky-600 dark:bg-sky-950 dark:text-sky-400 [&>svg]:h-4 [&>svg]:w-4">
        {icon}
      </span>
      <div>
        <b className="text-xs text-slate-900 dark:text-slate-100">{title}</b>
        <p className="mt-1 text-[9px] leading-4 text-slate-500 dark:text-slate-400">{copy}</p>
      </div>
    </div>
  );
}

function Article({ icon, tag, title, copy }: { icon: React.ReactNode; tag: string; title: string; copy: string }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900 flex items-center gap-4">
      <span className="rounded-xl bg-sky-100 p-3 text-sky-600 dark:bg-sky-950 dark:text-sky-400 [&>svg]:h-5 [&>svg]:w-5">
        {icon}
      </span>
      <div>
        <span className="text-[8px] font-bold uppercase tracking-wider text-sky-600">{tag}</span>
        <h3 className="mt-1 text-sm font-black text-slate-950 dark:text-white">{title}</h3>
        <p className="mt-1 text-[10px] text-slate-500 dark:text-slate-400">{copy}</p>
        <span className="mt-2 block text-[9px] font-bold text-sky-600">5 min read →</span>
      </div>
    </article>
  );
}

const reviews = [
  ['AK', 'The Shariah audit makes every pass and threshold easy to understand.', 'Stock research'],
  ['PS', 'IPO GMP, allotment and subscription data are much easier to follow.', 'IPO tracking'],
  ['FM', 'Metals and Zakat tools bring my research into one clear workflow.', 'Islamic wealth'],
  ['RK', 'The stock detail layout gives me the important numbers without confusion.', 'Long-term investing'],
  ['SA', 'I can compare valuations, growth and risks without opening several sites.', 'Fundamentals'],
  ['NM', 'Gold and silver city rates are presented clearly and update quickly.', 'Precious metals'],
  ['HI', 'The compliance methodology is transparent instead of showing only a badge.', 'Shariah screening'],
  ['VR', 'Delivery and ownership charts help me understand conviction better.', 'Trading'],
  ['AZ', 'The Zakat calculator makes the Nisab calculation simple to verify.', 'Zakat'],
  ['MJ', 'The IPO pages combine the dates, GMP and company research I need.', 'IPO research'],
  ['SK', 'Search and navigation make it easy to move between different markets.', 'Platform'],
  ['TA', 'The page feels useful for both active trading and long-term research.', 'Market research'],
] as const;

function ReviewMarquee() {
  const items = [...reviews, ...reviews];
  return (
    <section className="overflow-hidden py-12">
      <div className="container mx-auto flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black">Community feedback</h2>
          <p className="mt-1 text-xs text-slate-500">What investors value across WeeStox tools.</p>
        </div>
        <a
          href="mailto:care@weestox.com?subject=WeeStox%20feedback"
          className="rounded-lg border border-sky-300 px-4 py-2 text-xs font-bold text-sky-700 hover:bg-sky-50 dark:border-sky-800 dark:text-sky-300 dark:hover:bg-slate-900"
        >
          Share your feedback
        </a>
      </div>
      <div className="mt-7 overflow-hidden">
        <div className="flex w-max gap-4 animate-ticker">
          {items.map(([initials, text, category], index) => (
            <article key={`${initials}-${index}`} className="rounded-2xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900 w-[340px] shrink-0 p-5">
              <div className="flex items-center justify-between">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-100 text-xs font-black text-sky-700 dark:bg-sky-950 dark:text-sky-300">
                  {initials}
                </span>
                <span className="text-amber-500">★★★★★</span>
              </div>
              <p className="mt-4 text-xs leading-5 text-slate-600 dark:text-slate-300">“{text}”</p>
              <span className="mt-4 block text-[9px] font-bold uppercase tracking-wide text-slate-400">{category}</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
