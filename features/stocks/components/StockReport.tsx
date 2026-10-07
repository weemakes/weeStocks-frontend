'use client';

import { useRouter } from 'next/navigation';
import type { StockMasterDetail } from '../types';
import StockDetailDashboard from './StockDetailDashboard';

export default function StockReport({ detail }: { detail: StockMasterDetail }) {
  const router = useRouter();
  return <StockDetailDashboard detail={detail} isStandalonePage onSelectPeer={(symbol) => {
    const query = detail.company.country === 'India' ? '' : `?${new URLSearchParams({ country: detail.company.country })}`;
    router.push(`/stocks/${encodeURIComponent(symbol)}${query}`);
  }} />;
}
