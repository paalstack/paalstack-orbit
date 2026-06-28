'use client';

import { Box, Card, TypographyH3 } from '@paalstack/react-ui';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const STATUS_COLORS: Record<string, string> = {
  new: '#64748B',
  contacted: '#3B82F6',
  qualified: '#8B5CF6',
  proposal: '#F59E0B',
  won: '#22C55E',
  lost: '#EF4444',
};

type LeadsByStatusChartProps = {
  data: { status: string; count: number }[];
};

export const LeadsByStatusChart = ({ data }: LeadsByStatusChartProps) => {
  return (
    <Card header={{ title: 'Leads by Status' }}>
      <Box className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="count"
              nameKey="status"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label={({ name, percent }) =>
                `${String(name)} ${Math.round((percent as number) * 100)}%`
              }
            >
              {data.map((entry) => (
                <Cell key={entry.status} fill={STATUS_COLORS[entry.status] ?? '#64748B'} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                color: 'hsl(var(--foreground))',
              }}
            />
            <Legend
              formatter={(value: string) => (
                <TypographyH3 className="inline text-xs text-muted-foreground">{value}</TypographyH3>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </Box>
    </Card>
  );
};
