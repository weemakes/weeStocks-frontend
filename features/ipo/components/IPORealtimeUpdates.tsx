"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";


interface IPOEvent {
  event?: string;
  ipoName?: string;
  symbol?: string;
  ipoId?: number;
  message?: string;
  registrarUrl?: string;
  subscriptionData?: {
    total?: number;
    qib?: number;
    nii?: number;
    retail?: number;
    sharesBidded?: number;
    asOfTime?: string;
  };
}

export function IPORealtimeUpdates({ streamUrl }: { streamUrl: string }) {
  const router = useRouter();
  const [announcement, setAnnouncement] = useState<IPOEvent | null>(null);
  const refreshTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let source: EventSource | null = null;
    const handlePayload = (message: MessageEvent<string>) => {
      try {
        const payload = JSON.parse(message.data) as IPOEvent;
        if (payload.event === "ALLOTMENT_DECLARED" || payload.event === "SUBSCRIPTION_UPDATE") {
          setAnnouncement(payload);
        }
        if (refreshTimer.current) clearTimeout(refreshTimer.current);
        refreshTimer.current = setTimeout(() => router.refresh(), 250);
      } catch {
        // Ignore heartbeat/non-JSON frames while keeping the stream connected.
      }
    };

    const connect = () => {
      source = new EventSource(streamUrl);
      source.onmessage = handlePayload;
      ["ALLOTMENT_DECLARED", "GMP_UPDATE", "STATUS_CHANGE", "NEW_IPO_SAVED", "SUBSCRIPTION_UPDATE"].forEach((name) => {
        source?.addEventListener(name, handlePayload as EventListener);
      });
    };
    const connectionTimer = window.setTimeout(connect, 750);

    return () => {
      if (refreshTimer.current) clearTimeout(refreshTimer.current);
      window.clearTimeout(connectionTimer);
      source?.close();
    };
  }, [router, streamUrl]);

  useEffect(() => {
    if (!announcement) return;
    const timer = window.setTimeout(() => setAnnouncement(null), 15_000);
    return () => window.clearTimeout(timer);
  }, [announcement]);


  return (
    <>
      {announcement && (
        <div role="status" aria-live="polite" className={`fixed right-3 top-[86px] z-[90] w-[calc(100vw-1.5rem)] max-w-sm overflow-hidden rounded-xl border shadow-xl backdrop-blur sm:right-5 ${
          announcement.event === 'SUBSCRIPTION_UPDATE'
            ? 'border-sky-300 dark:border-sky-500/40 bg-white/98 dark:bg-slate-900/98'
            : 'border-emerald-300 dark:border-emerald-500/40 bg-white/98 dark:bg-slate-900/98'
        }`}>
          <div className={`h-1 w-full ${announcement.event === 'SUBSCRIPTION_UPDATE' ? 'bg-sky-500' : 'bg-emerald-500'}`} />
          <div className="px-3.5 py-3">
            <div className="flex items-start gap-2.5">
              <span aria-hidden="true" className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-base ${
                announcement.event === 'SUBSCRIPTION_UPDATE'
                  ? 'bg-sky-100 dark:bg-sky-500/15'
                  : 'bg-emerald-100 dark:bg-emerald-500/15'
              }`}>
                {announcement.event === 'SUBSCRIPTION_UPDATE' ? '🔥' : '🎉'}
              </span>
              <div className="min-w-0 flex-1">
                <p className={`text-sm font-bold leading-snug ${
                  announcement.event === 'SUBSCRIPTION_UPDATE'
                    ? 'text-sky-900 dark:text-sky-100'
                    : 'text-emerald-900 dark:text-emerald-100'
                }`}>
                  {announcement.event === 'SUBSCRIPTION_UPDATE'
                    ? `Live Bids: ${announcement.ipoName || 'IPO'}`
                    : `Allotment out: ${announcement.ipoName || 'IPO'}`}
                </p>
                <p className="mt-0.5 line-clamp-2 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
                  {announcement.message || (announcement.subscriptionData?.total ? `Total subscription reached ${announcement.subscriptionData.total}x` : 'Data refreshed.')}
                </p>
                {announcement.registrarUrl && (
                  <div className="mt-2">
                    <a href={announcement.registrarUrl} target="_blank" rel="noopener noreferrer" className="inline-flex rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700">
                      Check allotment
                    </a>
                  </div>
                )}
              </div>
              <button type="button" onClick={() => setAnnouncement(null)} aria-label="Dismiss alert" className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200">
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

    </>
  );
}
