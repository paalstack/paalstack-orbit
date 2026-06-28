import { Badge } from '@paalstack/react-ui';
import { cn } from '@paalstack/react-ui/lib';

import type { TeamRole } from '@/types/orbit';

const ROLE_COLORS: Record<TeamRole, string> = {
  admin: 'bg-violet-900/60 text-violet-300',
  manager: 'bg-amber-900/60 text-amber-300',
  sales: 'bg-blue-900/60 text-blue-300',
};

type RoleBadgeProps = {
  role: TeamRole;
  className?: string;
};

export const RoleBadge = ({ role, className }: RoleBadgeProps) => {
  return <Badge className={cn('border-0 capitalize', ROLE_COLORS[role], className)}>{role}</Badge>;
};
