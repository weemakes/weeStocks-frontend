import Link from 'next/link';

export default function NotFound() {
  return <div className="mx-auto max-w-xl px-4 py-16 text-center">
    <h1 className="text-2xl font-bold text-ink">Page not found</h1>
    <p className="my-4 text-muted">This page does not exist. Browse the directories to find a company or rate.</p>
    <div className="flex justify-center gap-5 text-accent"><Link href="/stocks">Stocks</Link><Link href="/ipo">IPOs</Link><Link href="/gold">Gold rates</Link></div>
  </div>;
}
