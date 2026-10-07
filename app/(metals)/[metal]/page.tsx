import { notFound, redirect } from 'next/navigation';
import { METAL_CONFIG, type Metal } from '@/features/metals/types';

// Keep the landing experience data-first; city reports retain their own SEO metadata.
export default async function MetalPage({ params }: { params: Promise<{ metal: string }> }) {
  const { metal } = await params;
  if (!METAL_CONFIG[metal as Metal]) notFound();
  redirect(`/${metal}/delhi`);
}
