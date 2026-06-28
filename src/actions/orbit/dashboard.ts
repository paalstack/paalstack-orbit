import { requireAuth } from '@/libs/supabase/auth';

export type DashboardStats = {
  leadsByStatus: { status: string; count: number }[];
  conversionRate: number;
  totalLeads: number;
  wonLeads: number;
  activityVolume: { date: string; count: number }[];
};

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const { supabase, error } = await requireAuth();
  if (error) throw new Error(error);

  const leadResp = await supabase.from('leads').select('status');
  if (leadResp.error) throw new Error(leadResp.error.message);

  const leadsByStatus = (leadResp.data ?? []) as { status: string }[];

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const activityResp = await supabase
    .from('activities')
    .select('created_at, type')
    .gte('created_at', thirtyDaysAgo.toISOString());

  if (activityResp.error) throw new Error(activityResp.error.message);

  const activities = (activityResp.data ?? []) as { created_at: string; type: string }[];

  const total = leadsByStatus.length;
  const won = leadsByStatus.filter((l) => l.status === 'won').length;
  const conversionRate = total > 0 ? Math.round((won / total) * 100) : 0;

  const statusCounts: Record<string, number> = {};
  for (const lead of leadsByStatus) {
    statusCounts[lead.status] = (statusCounts[lead.status] ?? 0) + 1;
  }

  const activityByDay: Record<string, number> = {};
  for (const activity of activities) {
    const day = activity.created_at.slice(0, 10);
    activityByDay[day] = (activityByDay[day] ?? 0) + 1;
  }

  return {
    leadsByStatus: Object.entries(statusCounts).map(([status, count]) => ({ status, count })),
    conversionRate,
    totalLeads: total,
    wonLeads: won,
    activityVolume: Object.entries(activityByDay)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, count]) => ({ date, count })),
  };
};
