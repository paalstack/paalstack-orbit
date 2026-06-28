import { Badge } from '@paalstack/react-ui';
import { cn } from '@paalstack/react-ui/lib';

import type { LeadStatus } from '@/types/orbit';

const STATUS_COLOR: Record<LeadStatus, string> = {
  new: 'bg-slate-700 text-slate-200',
  contacted: 'bg-blue-900/60 text-blue-300',
  qualified: 'bg-violet-900/60 text-violet-300',
  proposal: 'bg-amber-900/60 text-amber-300',
  won: 'bg-emerald-900/60 text-emerald-300',
  lost: 'bg-red-900/60 text-red-400',
};

type LeadStatusBadgeProps = {
  status: LeadStatus;
  className?: string;
};

export const LeadStatusBadge = ({ status, className }: LeadStatusBadgeProps) => {
  return (
    <Badge className={cn('border-0 capitalize', STATUS_COLOR[status], className)}>{status}</Badge>
  );
};
