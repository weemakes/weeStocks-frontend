'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

// Track useful actions without collecting search text, holdings or application details.
export default function ResearchEvents() {
  const pathname = usePathname();
  useEffect(() => {
    let calculatorUsed = false;
    const emit = (name: string, parameters: Record<string, string>) => {
      const analytics = window as Window & { gtag?: (command: string, name: string, parameters: Record<string, string>) => void };
      analytics.gtag?.('event', name, parameters);
    };
    if (/^\/(stocks|ipo)\/[^/]+$/.test(pathname)) {
      emit('view_research_report', { report_type: pathname.startsWith('/ipo/') ? 'ipo' : 'stock' });
    }
    const click = (event: MouseEvent) => {
      const link = event.target instanceof Element ? event.target.closest('a') : null;
      if (!link) return;
      const destination = new URL(link.href, window.location.origin);
      if (destination.origin === window.location.origin && /^\/(stocks|ipo)\/[^/]+$/.test(destination.pathname)) {
        emit('open_research_report', { report_type: destination.pathname.startsWith('/ipo/') ? 'ipo' : 'stock' });
      }
    };
    const change = (event: Event) => {
      if (!calculatorUsed && event.target instanceof Element && event.target.closest('[data-analytics="metal-calculator"]')) {
        calculatorUsed = true;
        emit('use_metal_calculator', { page_path: pathname });
      }
    };
    document.addEventListener('click', click);
    document.addEventListener('change', change);
    return () => { document.removeEventListener('click', click); document.removeEventListener('change', change); };
  }, [pathname]);
  return null;
}
