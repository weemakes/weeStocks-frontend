import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Search, ShieldCheck, ChartNoAxesCombined, Gem, Rocket, Calculator, SlidersHorizontal, Globe2, Layers, Check } from 'lucide-react';

const tools = [
  { href: '/stocks', name: 'Stock screener', text: 'Find companies that fit your values. Compare business activity, debt, and fundamentals.', Icon: ChartNoAxesCombined, label: 'RESEARCH', color: 'blue' },
  { href: '/ipo', name: 'The next market debut', text: 'Explore upcoming IPOs, subscription demand, issue details, and reported GMP.', Icon: Rocket, label: 'DISCOVER', color: 'purple' },
  { href: '/gold', name: 'Precious metals', text: 'Compare city rates, explore historical trends, and estimate your purchase cost.', Icon: Gem, label: 'EXPLORE', color: 'gold' },
  { href: '/zakat', name: 'Wealth with purpose', text: 'Bring your assets together for a transparent, step-by-step Zakat estimate.', Icon: Calculator, label: 'CALCULATE', color: 'green' },
];
export default function HomePage() {
  return <div className="home-page">
    <section className="home-hero"><div className="container hero-grid">
      <div className="hero-copy"><span className="hero-pill"><ShieldCheck size={15} /> Thoughtful research. Informed choices.</span>
        <h1>Invest with clarity.<br /><span>Stay true to your values.</span></h1>
        <p>Stocks, IPOs, precious metals, and wealth tools.<br className="hidden md:block" /> One considered space for your financial research.</p>
        <form action="/stocks" className="hero-search"><Search size={20} /><input name="search" aria-label="Search companies" placeholder="Search a company or symbol…" /><button type="submit" aria-label="Search companies"><ArrowRight size={20} /></button></form>
        <div className="hero-shortcuts"><span>Start exploring</span><Link href="/stocks?status=compliant">Halal stocks <ArrowUpRight size={13} /></Link><Link href="/ipo?status=upcoming">Upcoming IPOs <ArrowUpRight size={13} /></Link></div>
        <div className="hero-trust"><span><Check size={14} /> Clear screening criteria</span><span><Check size={14} /> No account needed</span></div>
      </div>
      <div className="research-preview" aria-label="Illustration of the research workflow">
        <div className="preview-top"><div className="flex items-center gap-2"><span className="preview-icon"><ChartNoAxesCombined size={18} /></span><strong>Your research, simplified</strong></div><span className="preview-label">WORKSPACE</span></div>
        <div className="preview-heading"><div><span className="eyebrow">LOOK BEYOND THE PRICE</span><h2>A more complete picture.</h2></div><span className="preview-orbit"><ShieldCheck size={26} /></span></div>
        <div className="preview-steps">{[{ Icon: Globe2, title: 'Discover a company', text: 'Search across supported markets', number: '01' }, { Icon: SlidersHorizontal, title: 'Understand the fundamentals', text: 'Valuation, financials, and debt', number: '02' }, { Icon: ShieldCheck, title: 'Review the screening', text: 'Source-backed compliance details', number: '03' }].map(({Icon,title,text,number})=><div className="preview-step" key={number}><span className="step-icon"><Icon size={19}/></span><div><strong>{title}</strong><p>{text}</p></div><span className="step-number">{number}</span></div>)}</div>
        <Link href="/stocks" className="preview-bottom">Open your stock screener <ArrowRight size={17} /></Link>
        <div className="preview-float"><Layers size={18} /><div><strong>More context. Less noise.</strong><span>Built for curious investors.</span></div></div>
      </div>
    </div></section>
    <section className="container tools-section"><div className="section-title"><div><span className="eyebrow">YOUR RESEARCH TOOLKIT</span><h2>One place. A wider perspective.</h2></div><p>Go from a question to a clearer understanding.</p></div>
      <div className="tool-grid">{tools.map(({href,name,text,Icon,label,color})=><Link href={href} key={href} className={'tool-card '+color}><div className="tool-card-top"><span className="tool-icon"><Icon size={24}/></span><ArrowUpRight size={19}/></div><span className="eyebrow">{label}</span><h3>{name}</h3><p>{text}</p><span className="tool-link">Explore tool <ArrowRight size={15}/></span></Link>)}</div>
    </section>
    <section className="container principles-section"><div className="principles-card"><div><span className="eyebrow">CONFIDENCE COMES FROM CONTEXT</span><h2>Research that shows its working.</h2><p>Understand what a number means, where it comes from, and what is still unknown. A screening result is the beginning of your research.</p><Link href="/about" className="text-accent inline-flex items-center gap-2 font-semibold text-sm">Our approach <ArrowRight size={16}/></Link></div><div className="principle-list"><div><span>01</span><section><h3>Values at the centre</h3><p>Explore business activity and financial screening together.</p></section></div><div><span>02</span><section><h3>The detail behind the data</h3><p>Review source metrics and dates before drawing a conclusion.</p></section></div><div><span>03</span><section><h3>Useful, understandable tools</h3><p>Transparent calculations, with assumptions you can see.</p></section></div></div></div></section>
  </div>;
}
