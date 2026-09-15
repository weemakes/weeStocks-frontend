import Link from 'next/link';
import { Search } from 'lucide-react';
export default function NotFound() { return <div className="container py-14"><div className="surface empty-state"><Search size={30}/><span className="eyebrow">404 · PAGE NOT FOUND</span><h1 className="text-2xl">Let’s find a better starting point.</h1><p>This company, city, or page could not be found.</p><Link href="/" className="btn btn-primary">Back to WeeStox</Link></div></div>; }
