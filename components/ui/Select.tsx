'use client';

import { useEffect, useId, useLayoutEffect, useRef, useState, type KeyboardEvent } from 'react';
import { createPortal } from 'react-dom';
import { Check, ChevronDown } from 'lucide-react';
import styles from './Select.module.css';

export interface SelectOption { value: string; label: string; description?: string }
interface Props { label: string; value: string; options: SelectOption[]; onChange: (value: string) => void; className?: string }

export default function Select({ label, value, options, onChange, className = '' }: Props) {
  const id = useId();
  const trigger = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const typed = useRef({ value: '', time: 0 });
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [position, setPosition] = useState({ top: 0, left: 0, width: 180, maxHeight: 300 });
  const selectedIndex = options.findIndex(option => option.value === value);
  const selected = options[selectedIndex];

  function locate() {
    const rect = trigger.current?.getBoundingClientRect();
    if (!rect) return;
    const below = window.innerHeight - rect.bottom - 12;
    const above = rect.top - 12;
    const up = below < 180 && above > below;
    const maxHeight = Math.max(60, Math.min(300, up ? above : below));
    const height = Math.min(maxHeight, options.length * 43 + 12);
    const width = Math.min(Math.max(rect.width, 210), window.innerWidth - 16);
    setPosition({ top: up ? rect.top - height - 6 : rect.bottom + 6, left: Math.max(8, Math.min(rect.left, window.innerWidth - width - 8)), width, maxHeight });
  }
  function expand() { locate(); setActive(Math.max(0, selectedIndex)); setOpen(true); }
  function choose(index: number) { const option = options[index]; if (option) onChange(option.value); setOpen(false); trigger.current?.focus(); }

  useEffect(() => {
    if (!open) return;
    const dismiss = (event: PointerEvent) => { if (!trigger.current?.contains(event.target as Node) && !menu.current?.contains(event.target as Node)) setOpen(false); };
    // Reposition on page or nested-result scrolling without clipping the menu.
    const reposition = () => {
      const rect = trigger.current?.getBoundingClientRect();
      if (!rect) return;
      const below = window.innerHeight - rect.bottom - 12, above = rect.top - 12;
      const up = below < 180 && above > below;
      const maxHeight = Math.max(60, Math.min(300, up ? above : below));
      const height = Math.min(maxHeight, menu.current?.scrollHeight ?? maxHeight);
      const width = Math.min(Math.max(rect.width, 210), window.innerWidth - 16);
      setPosition({ top: up ? rect.top - height - 6 : rect.bottom + 6, left: Math.max(8, Math.min(rect.left, window.innerWidth - width - 8)), width, maxHeight });
    };
    document.addEventListener('pointerdown', dismiss);
    window.addEventListener('resize', reposition);
    window.addEventListener('scroll', reposition, true);
    return () => { document.removeEventListener('pointerdown', dismiss); window.removeEventListener('resize', reposition); window.removeEventListener('scroll', reposition, true); };
  }, [open]);
  useEffect(() => { if (open) menu.current?.querySelector<HTMLElement>(`[data-index="${active}"]`)?.scrollIntoView({ block: 'nearest' }); }, [active, open]);
  useLayoutEffect(() => {
    if (!open || !menu.current) return;
    const popup = menu.current;
    const fit = () => {
      const rect = trigger.current?.getBoundingClientRect();
      if (!rect) return;
      const below = window.innerHeight - rect.bottom - 12;
      const above = rect.top - 12;
      popup.style.top = `${below < 180 && above > below ? rect.top - popup.getBoundingClientRect().height - 6 : rect.bottom + 6}px`;
    };
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(popup);
    return () => observer.disconnect();
  }, [open]);

  function keyboard(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === 'Escape' || event.key === 'Tab') { setOpen(false); if (event.key === 'Escape') event.preventDefault(); return; }
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); if (open) choose(active); else expand(); return; }
    if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
      event.preventDefault();
      if (!open) { expand(); return; }
      setActive(index => event.key === 'Home' ? 0 : event.key === 'End' ? options.length - 1 : Math.max(0, Math.min(options.length - 1, index + (event.key === 'ArrowDown' ? 1 : -1))));
      return;
    }
    if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
      event.preventDefault();
      const now = Date.now();
      const text = (now - typed.current.time < 700 ? typed.current.value : '') + event.key.toLowerCase();
      typed.current = { value: text, time: now };
      if (!open) expand();
      const index = options.findIndex(option => option.label.toLowerCase().startsWith(text));
      if (index >= 0) setActive(index);
    }
  }
  return <div className={`${styles.root} ${className}`}>
    <button ref={trigger} type="button" role="combobox" aria-label={label} aria-haspopup="listbox" aria-expanded={open} aria-controls={open ? id : undefined} aria-activedescendant={open ? `${id}-${active}` : undefined} className={styles.trigger} onClick={() => open ? setOpen(false) : expand()} onKeyDown={keyboard} onBlur={event => { if (!menu.current?.contains(event.relatedTarget as Node)) setOpen(false); }}>
      <span>{selected?.label ?? value}</span><ChevronDown size={15} className={open ? styles.rotated : ''} />
    </button>
    {open && createPortal(<div ref={menu} id={id} role="listbox" aria-label={label} className={styles.menu} style={position}>
      {options.map((option, index) => <button key={option.value} id={`${id}-${index}`} type="button" role="option" aria-selected={option.value === value} tabIndex={-1} data-index={index} className={`${styles.option} ${active === index ? styles.active : ''}`} onPointerDown={event => event.preventDefault()} onPointerMove={() => setActive(index)} onClick={() => choose(index)}><span>{option.label}{option.description && <small>{option.description}</small>}</span>{option.value === value && <Check size={14} />}</button>)}
    </div>, document.body)}
  </div>;
}
