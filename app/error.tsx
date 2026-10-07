'use client';

import Link from 'next/link';

export default function ErrorPage({ reset }: { reset: () => void }) {
  return <div className="mx-auto max-w-xl px-4 py-16 text-center">
    <h1 className="text-2xl font-bold text-ink">Report temporarily unavailable</h1>
    <p className="my-4 text-muted">We could not retrieve this report. Please try again shortly.</p>
    <button onClick={reset} className="btn btn-primary">Try again</button>
    <Link href="/" className="ml-4 text-accent">Back to WeeStox</Link>
  </div>;
}
