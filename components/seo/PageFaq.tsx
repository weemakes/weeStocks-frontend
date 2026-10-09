import Link from 'next/link';
import JsonLd from './JsonLd';
import { getFaqSchema } from './siteSchemas';

export type FaqItem = { question: string; answer: string };

export default function PageFaq({ title = 'Frequently asked questions', items, links = [], schema = true }: {
  title?: string; items: FaqItem[]; links?: { label: string; href: string }[]; schema?: boolean;
}) {
  return <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14" aria-label={title}>
    {schema && <JsonLd data={getFaqSchema(items)} />}
    <h2 className="text-2xl font-bold tracking-tight text-ink">{title}</h2>
    <div className="mt-6 divide-y divide-line rounded-2xl border border-line bg-panel px-5 sm:px-6">
      {items.map(({ question, answer }) => <details key={question} className="group py-4">
        <summary className="cursor-pointer text-sm font-semibold leading-6 text-ink focus-visible:outline-2 focus-visible:outline-sky-500">{question}</summary>
        <p className="mt-3 text-sm leading-7 text-body">{answer}</p>
      </details>)}
    </div>
    {links.length > 0 && <nav aria-label="Related research" className="mt-5 flex flex-wrap gap-3">
      {links.map(link => <Link key={link.href} href={link.href} className="rounded-lg border border-line px-3 py-2 text-sm font-medium text-accent hover:bg-well">{link.label} →</Link>)}
    </nav>}
  </section>;
}
