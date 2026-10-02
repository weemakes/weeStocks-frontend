import { IPORealtimeUpdates } from "@/features/ipo/components/IPORealtimeUpdates";

export default function IPOLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <IPORealtimeUpdates streamUrl="/api/ipo/live-stream" />
      {children}
    </>
  );
}
