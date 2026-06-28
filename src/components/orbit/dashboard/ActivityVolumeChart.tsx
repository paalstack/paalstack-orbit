'use client';

import { Box, Card } from '@paalstack/react-ui';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

type ActivityVolumeChartProps = {
  data: { date: string; count: number }[];
};

export const ActivityVolumeChart = ({ data }: ActivityVolumeChartProps) => {
  return (
    <Card header={{ title: 'Activity Volume (Last 30 Days)' }}>
      <Box className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="activityGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="date"
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: 'hsl(var(--border))' }}
              tickFormatter={(v: string) => v.slice(5)}
            />
            <YAxis
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                color: 'hsl(var(--foreground))',
              }}
            />
            <Area
              type="monotone"
              dataKey="count"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              fill="url(#activityGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </Box>
    </Card>
  );
};
