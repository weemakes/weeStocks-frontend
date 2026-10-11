/** Treat missing API fields and serialized missing-value placeholders consistently. */
export function displayValue(value: unknown, fallback = '–'): string {
  if (value == null) return fallback;
  if (typeof value === 'number') return Number.isFinite(value) ? String(value) : fallback;
  const text = String(value).trim();
  return !text || /\b(?:null|undefined|NaN)\b/i.test(text) ? fallback : text;
}

export function displayDateRange(display: unknown, start: unknown, end: unknown): string {
  const supplied = displayValue(display, '');
  if (supplied) return supplied;
  const first = displayValue(start);
  const last = displayValue(end);
  return first === '–' && last === '–' ? '–' : `${first} → ${last}`;
}

export function displayNumber(value: unknown, prefix = '', suffix = ''): string {
  if (value == null || displayValue(value, '') === '') return '–';
  const number = Number(value);
  return Number.isFinite(number) ? `${prefix}${number.toLocaleString('en-IN')}${suffix}` : '–';
}
