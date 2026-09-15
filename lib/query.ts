export function queryUrl(path: string, current: Record<string, unknown>, updates: Record<string, unknown>) {
  const params = new URLSearchParams();
  for (const [key,value] of Object.entries({...current,...updates})) {
    if (value !== undefined && value !== null && value !== '' && value !== 'all') params.set(key,String(value));
  }
  return path + (params.size ? '?' + params.toString() : '');
}
