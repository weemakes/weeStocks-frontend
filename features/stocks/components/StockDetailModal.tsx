'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, ExternalLink, Loader2, AlertTriangle } from 'lucide-react';
import { StockItem, StockMasterDetail } from '../types';
import { getStockDetail } from '../api';
import StockDetailContent from './StockDetailContent';

interface StockDetailModalProps {
  stock: StockItem | null;
  onClose: () => void;
  onSelectStock?: (stock: StockItem) => void;
}

export default function StockDetailModal({ stock, onClose, onSelectStock }: StockDetailModalProps) {
  const [detail, setDetail] = useState<StockMasterDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentSymbol, setCurrentSymbol] = useState<string | null>(stock?.symbol || null);

  useEffect(() => {
    if (stock) {
      setCurrentSymbol(stock.symbol);
    }
  }, [stock]);

  useEffect(() => {
    if (!currentSymbol) return;
    let isMounted = true;

    async function loadMaster() {
      setLoading(true);
      setError(null);
      try {
        const res = await getStockDetail(currentSymbol!, stock?.country);
        if (isMounted) {
          if (res) {
            setDetail(res);
          } else {
            setError('Could not load complete profile.');
          }
        }
      } catch (err: any) {
        console.error('Failed to load stock master detail:', err);
        if (isMounted) setError(err?.message || 'Error loading stock analysis.');
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadMaster();
    return () => {
      isMounted = false;
    };
  }, [currentSymbol, stock?.country]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!stock) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-6 overflow-y-auto backdrop-blur-md bg-slate-950/60 transition-all">
      <div
        className="relative w-full max-w-5xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-slate-200 dark:border-slate-800/80 bg-slate-50/80 dark:bg-slate-950/80 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Institutional Analysis
            </span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              {stock.symbol} ({stock.exchange})
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/stocks/${stock.symbol}?country=${encodeURIComponent(stock.country || 'India')}`}
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-950/50 border border-sky-500/20 transition-all"
            >
              <span>Full Page</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 md:p-8">
          {loading ? (
            <div className="py-24 flex flex-col items-center justify-center gap-3 text-slate-500 dark:text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin text-sky-600 dark:text-sky-400" />
              <p className="text-sm font-medium">Aggregating 14-section institutional report for {currentSymbol}...</p>
            </div>
          ) : error || !detail ? (
            <div className="py-16 text-center">
              <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto mb-2" />
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">
                Unable to load full report
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
                {error || 'The exchange data feed for this equity is currently synchronizing.'}
              </p>
              <button
                type="button"
                onClick={() => setCurrentSymbol(stock.symbol)}
                className="px-4 py-2 rounded-xl bg-sky-600 text-white text-xs font-semibold hover:bg-sky-700"
              >
                Retry Loading
              </button>
            </div>
          ) : (
            <StockDetailContent
              detail={detail}
              onSelectPeer={(sym) => setCurrentSymbol(sym)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
