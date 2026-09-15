import Link from 'next/link';
import { ChartNoAxesCombined, ArrowUpRight } from 'lucide-react';
export default function Footer() {
  return <footer className="site-footer"><div className="container">
    <div className="footer-grid"><div><Link href="/" className="brand"><span className="brand-mark"><ChartNoAxesCombined size={21} /></span>Wee<span>Stox</span></Link><p className="mt-4 max-w-xs text-sm text-muted leading-relaxed">A clearer view of your investments.<br />Research stocks, explore metals, and build financial understanding.</p></div>
      <div><h3>Explore markets</h3><Link href="/stocks">Stock screener</Link><Link href="/ipo">IPO insights</Link><Link href="/gold">Precious metals</Link></div>
      <div><h3>Your toolkit</h3><Link href="/zakat">Zakat calculator</Link><Link href="/about">Screening methodology</Link><a href="mailto:care@weestox.com">Get in touch <ArrowUpRight size={13} /></a></div>
      <div className="footer-note"><span className="eyebrow">RESEARCH WITH CONTEXT</span><p>Screening is a starting point. Review the source data, reporting date, and methodology before making a decision.</p></div>
    </div><div className="footer-bottom"><span>© {new Date().getFullYear()} WeeStox. All rights reserved.</span><span>For education and research. Not investment advice.</span></div>
  </div></footer>;
}
