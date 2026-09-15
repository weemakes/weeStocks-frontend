import { ShieldCheck, CircleHelp, ShieldAlert, ShieldX } from 'lucide-react';
import type { ComplianceStatus } from '../types';
const states = {
  compliant: { label: 'Halal', Icon: ShieldCheck, className: 'text-positive bg-emerald-500/10' },
  doubtful: { label: 'Under review', Icon: ShieldAlert, className: 'text-warning bg-amber-500/10' },
  non_compliant: { label: 'Non-Halal', Icon: ShieldX, className: 'text-negative bg-rose-500/10' },
  unknown: { label: 'Not screened', Icon: CircleHelp, className: 'text-muted bg-well' },
};
export function ComplianceBadge({ status }: { status: ComplianceStatus }) {
  const { label, Icon, className } = states[status];
  return <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold whitespace-nowrap ${className}`}><Icon size={13} />{label}</span>;
}
