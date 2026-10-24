'use client';

import { useEffect, useState } from 'react';

export interface IPONavItem {
  id: string;
  label: string;
  badge?: string;
  tone?: 'default' | 'amber' | 'emerald' | 'sky';
}

interface IPODetailStickyNavProps {
  items: IPONavItem[];
}

export function IPODetailStickyNav({ items }: IPODetailStickyNavProps) {
  const [activeSection, setActiveSection] = useState<string>(items[0]?.id || 'market-data');
  const navIds = items.map((i) => i.id).join('|');

  useEffect(() => {
    const ids = navIds.split('|').filter(Boolean);
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => Boolean(element));

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => Math.abs(a.boundingClientRect.top - 132) - Math.abs(b.boundingClientRect.top - 132));

        if (visible[0]?.target.id) {
          setActiveSection(visible[0].target.id);
        }
      },
      { rootMargin: '-128px 0px -68% 0px', threshold: [0, 0.05, 0.2] }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [navIds]);

  const navigateToSection = (id: string) => {
    const target = document.getElementById(id);
    if (!target) return;
    setActiveSection(id);
    window.scrollTo({
      top: target.getBoundingClientRect().top + window.scrollY - 136,
      behavior: 'smooth',
    });
  };

  return (
    <nav
      aria-label="IPO detail sections"
      className="sticky top-[80px] sm:top-[82px] md:top-[84px] z-30 mb-3 sm:mb-4 flex gap-1 overflow-x-auto rounded-xl border border-slate-200 bg-white/95 px-2 py-1 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-950/95 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
    >
      {items.map((item) => {
        const isSelected = activeSection === item.id;
        return (
          <button
            key={item.id}
            type="button"
            aria-current={isSelected ? 'location' : undefined}
            onClick={() => navigateToSection(item.id)}
            className={`shrink-0 border-b-2 px-3 py-2 text-[11px] font-bold transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              isSelected
                ? 'border-sky-600 bg-sky-50/80 text-sky-700 dark:bg-sky-950/50 dark:text-sky-300'
                : 'border-transparent text-slate-500 hover:border-sky-300 hover:text-sky-600 dark:text-slate-400 dark:hover:text-sky-300'
            }`}
          >
            <span>{item.label}</span>
            {item.badge && (
              <span
                className={`text-[9px] px-1.5 py-0.2 rounded-md font-bold uppercase tracking-tight ${
                  isSelected
                    ? 'bg-sky-600 text-white dark:bg-sky-500 dark:text-white'
                    : item.tone === 'amber'
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300'
                    : item.tone === 'emerald'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300'
                    : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                }`}
              >
                {item.badge}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
}
