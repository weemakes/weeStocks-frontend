import Link from 'next/link';
import { ArrowRight, BarChart3, Calculator, Check, Coins, FileText, Mail, Rocket, ShieldCheck } from 'lucide-react';

const tools = [
  { name: 'Stock research', href: '/stocks', icon: BarChart3, color: 'text-sky-600 bg-sky-50 dark:bg-sky-950/50 dark:text-sky-400', copy: 'Understand the company behind the ticker.', features: ['Share prices and historical charts', 'Financial statements and valuation ratios', 'Peer comparisons and Shariah screening'] },
  { name: 'IPO tracker', href: '/ipo', icon: Rocket, color: 'text-rose-600 bg-rose-50 dark:bg-rose-950/50 dark:text-rose-400', copy: 'Follow an IPO from announcement to listing.', features: ['Issue dates, price bands and lot sizes', 'GMP history and subscription figures', 'Allotment updates, financials and company details'] },
  { name: 'Precious metals', href: '/gold', icon: Coins, color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/50 dark:text-amber-400', copy: 'Put today’s rate in context.', features: ['Gold, silver and platinum rates by city', 'Recent price changes and historical trends', 'Purity, weight and purchase-cost calculators'] },
  { name: 'Zakat tools', href: '/zakat', icon: Calculator, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 dark:text-emerald-400', copy: 'Work through your wealth calculations.', features: ['Gold and silver Nisab reference values', 'Asset-based Zakat calculations', 'Tools for investors who need Islamic wealth guidance'] },
];

export default function AboutPage() {
  return <div className="bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
    <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-br from-sky-50 via-white to-emerald-50/50 dark:border-slate-800 dark:from-slate-900 dark:via-slate-950 dark:to-sky-950/30">
      <div className="container mx-auto grid gap-8 py-10 sm:py-14 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div>
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-sky-600 dark:text-sky-400">About WeeStox</p>
          <h1 className="max-w-3xl text-3xl font-bold leading-tight tracking-tight sm:text-5xl">A clearer view of stocks, IPOs and precious metals.</h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-600 dark:text-slate-400">WeeStox is a market research platform that brings company financials, IPO updates, metal rates and practical calculators into one place. We help you explore the numbers and ask better questions before making a decision.</p>
          <div className="mt-6 flex flex-wrap gap-3"><Link href="/stocks" className="inline-flex items-center gap-2 rounded-xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white hover:bg-sky-500">Explore stock research <ArrowRight className="h-4 w-4" /></Link><Link href="/ipo" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800">Browse IPOs</Link></div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/90">
          <div className="mb-5 flex items-center gap-3"><div className="rounded-xl bg-sky-50 p-3 text-sky-600 dark:bg-sky-950"><FileText className="h-5 w-5" /></div><h2 className="font-bold">Research with context</h2></div>
          {['Understand a company’s financial performance', 'Follow IPO dates, demand and allotment updates', 'Compare metal rates and estimate purchase costs'].map((item) => <p key={item} className="flex gap-3 border-t border-slate-100 py-4 text-sm leading-relaxed text-slate-600 dark:border-slate-800 dark:text-slate-400"><Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />{item}</p>)}
          <p className="text-xs leading-relaxed text-slate-500">For everyday investors, IPO applicants and people researching gold, silver or platinum.</p>
        </div>
      </div>
    </section>

    <section className="container mx-auto py-10 sm:py-14">
      <p className="text-xs font-bold uppercase tracking-widest text-sky-600 dark:text-sky-400">What you can do</p>
      <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">Four tools. One research workspace.</h2>
      <div className="mt-7 grid gap-4 md:grid-cols-2">
        {tools.map(({ name, href, icon: Icon, color, copy, features }) => <article key={name} className="rounded-2xl border border-slate-200 p-6 transition-colors hover:border-sky-300 dark:border-slate-800 dark:hover:border-slate-600">
          <div className="flex items-center gap-3"><div className={`rounded-xl p-3 ${color}`}><Icon className="h-5 w-5" /></div><h3 className="text-lg font-bold">{name}</h3></div>
          <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">{copy}</p>
          <ul className="my-5 space-y-2.5">{features.map((feature) => <li key={feature} className="flex gap-2 text-sm text-slate-600 dark:text-slate-400"><Check className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />{feature}</li>)}</ul>
          <Link href={href} className="inline-flex items-center gap-1.5 text-sm font-semibold text-sky-600 hover:underline dark:text-sky-400">Explore {name.toLowerCase()} <ArrowRight className="h-4 w-4" /></Link>
        </article>)}
      </div>
    </section>

    <section className="border-y border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/40">
      <div className="container mx-auto py-10 sm:py-12">
        <h2 className="text-2xl font-bold tracking-tight">How to use WeeStox</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-3">{[
          ['01', 'Start with a question', 'Find a company, an IPO or a city’s metal rate. Go directly to the information you need.'],
          ['02', 'Explore the evidence', 'Read the figures alongside reporting periods, historical trends and available comparisons.'],
          ['03', 'Verify before deciding', 'Check important details against company filings, exchange notices or the official registrar.'],
        ].map(([step, title, copy]) => <div key={step}><span className="text-sm font-bold text-sky-600 dark:text-sky-400">{step}</span><h3 className="mt-2 font-bold">{title}</h3><p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{copy}</p></div>)}</div>
      </div>
    </section>

    <section className="container mx-auto grid gap-7 py-10 sm:py-14 lg:grid-cols-2">
      <div><ShieldCheck className="mb-4 h-7 w-7 text-emerald-600" /><h2 className="text-2xl font-bold">Optional Shariah screening</h2><p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-400">For investors who need it, company reports include screening based on AAOIFI Standard No. 21, with available financial ratios and compliance details. Screening depends on the underlying data and reporting period. It should not be treated as a guarantee or a substitute for qualified guidance.</p></div>
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900"><h2 className="text-xl font-bold">Understanding the data</h2><ul className="mt-4 space-y-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400"><li>Market data is supplied through WeeStox’s data service and may be delayed. Check the dates shown on reports.</li><li>IPO GMP is an unofficial market indicator. It does not guarantee a listing price or return.</li><li>Metal rates depend on location, purity and unit. Retail prices may include additional charges.</li><li>Tools and calculations support research; they are not personalized investment advice.</li></ul></div>
    </section>

    <section className="container mx-auto pb-12"><div className="flex flex-col gap-5 rounded-2xl border border-sky-200 bg-sky-50 p-6 sm:flex-row sm:items-center sm:justify-between dark:border-sky-900 dark:bg-sky-950/30"><div><h2 className="text-xl font-bold">Help us make research clearer.</h2><p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-400">Have a question or found a discrepancy? Send the page URL, the figure and a supporting source to our team.</p></div><a href="mailto:care@weestox.com" className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-sky-600 hover:underline dark:text-sky-400"><Mail className="h-4 w-4" />care@weestox.com</a></div></section>
  </div>;
}
