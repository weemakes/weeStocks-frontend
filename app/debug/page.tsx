import Link from 'next/link';
import { notFound } from 'next/navigation';
export default function DebugPage(){if(process.env.NODE_ENV!=='development')notFound();return <div className="container py-12"><h1 className="text-2xl">Development diagnostics</h1><p className="mt-4 text-muted">Use the <Link prefetch={false} className="text-accent underline" href="/api/test-backend">connectivity check</Link> to check the backend. Server configuration is not exposed.</p></div>}
