'use client';
import { RotateCcw, CloudOff } from 'lucide-react';
export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <div className="container py-12"><div className="surface empty-state"><div className="empty-icon"><CloudOff size={28}/></div><h1 className="text-2xl">A brief pause in the data.</h1><p>We could not load this page. Your connection or the data service may be temporarily unavailable.</p><button onClick={reset} className="btn btn-primary"><RotateCcw size={15}/>Try again</button></div></div>;
}
