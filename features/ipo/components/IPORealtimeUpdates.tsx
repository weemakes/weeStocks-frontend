"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Radio, X } from "lucide-react";

type ConnectionState = "connecting" | "connected" | "offline";

interface IPOEvent {
  event?: string;
  ipoName?: string;
  message?: string;
  registrarUrl?: string;
}

export function IPORealtimeUpdates({ streamUrl }: { streamUrl: string }) {
  const router = useRouter();
  const [connection, setConnection] = useState<ConnectionState>("connecting");
  const [announcement, setAnnouncement] = useState<IPOEvent | null>(null);
  const refreshTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let source: EventSource | null = null;
    const handlePayload = (message: MessageEvent<string>) => {
      try {
        const payload = JSON.parse(message.data) as IPOEvent;
        if (payload.event === "ALLOTMENT_DECLARED") setAnnouncement(payload);
        if (refreshTimer.current) clearTimeout(refreshTimer.current);
        refreshTimer.current = setTimeout(() => router.refresh(), 250);
      } catch {
        // Ignore heartbeat/non-JSON frames while keeping the stream connected.
      }
    };

    const connect = () => {
      source = new EventSource(streamUrl);
      source.onopen = () => setConnection("connected");
      source.onerror = () => setConnection(source?.readyState === EventSource.CLOSED ? "offline" : "connecting");
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

  const label = connection === "connected" ? "Live updates active" : connection === "connecting" ? "Reconnecting…" : "Live updates offline";
  const dot = connection === "connected" ? "bg-emerald-500" : connection === "connecting" ? "bg-amber-500" : "bg-rose-500";

  return (
    <>
      {announcement && (
        <div role="status" aria-live="polite" className="fixed right-3 top-[86px] z-[90] w-[calc(100vw-1.5rem)] max-w-sm overflow-hidden rounded-xl border border-emerald-300 bg-white/98 shadow-xl backdrop-blur dark:border-emerald-500/40 dark:bg-slate-900/98 sm:right-5">
          <div className="h-1 w-full bg-emerald-500" />
          <div className="px-3.5 py-3">
          <div className="flex items-start gap-2.5">
            <span aria-hidden="true" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-base dark:bg-emerald-500/15">🎉</span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold leading-snug text-emerald-900 dark:text-emerald-100">Allotment out: {announcement.ipoName || "IPO allotment declared"}</p>
              <p className="mt-0.5 line-clamp-2 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">{announcement.message || "Check your allotment status now."}</p>
              <div className="mt-2">
                {announcement.registrarUrl && <a href={announcement.registrarUrl} target="_blank" rel="noopener noreferrer" className="inline-flex rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700">Check allotment</a>}
              </div>
            </div>
            <button type="button" onClick={() => setAnnouncement(null)} aria-label="Dismiss allotment alert" className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"><X className="h-4 w-4" /></button>
          </div>
          </div>
        </div>
      )}
      <div className="fixed bottom-4 right-4 z-50 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/95 px-3 py-1.5 text-[11px] font-semibold text-slate-700 shadow-lg backdrop-blur dark:border-slate-700 dark:bg-slate-900/95 dark:text-slate-200" title={`IPO ${label.toLowerCase()}`}>
        <Radio className="h-3.5 w-3.5" />
        <span className={`h-2 w-2 rounded-full ${dot} ${connection === "connecting" ? "animate-pulse" : ""}`} />
        {label}
      </div>
    </>
  );
}
