
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, ComposedChart } from 'recharts';
import { HREfficiencyCase } from "@/types/hr-types";
import { Timer, ChartLine, HourglassIcon } from "lucide-react";

interface TimeToHireOverviewProps {
  cases: HREfficiencyCase[];
}

export function TimeToHireOverview({ cases }: TimeToHireOverviewProps) {
  // Calculate average time-to-hire and other metrics
  const avgTimeToHire = cases.length > 0 
    ? Math.round(cases.reduce((sum, c) => sum + c.time_to_hire, 0) / cases.length) 
    : 0;

  const maxTimeToHire = Math.max(...cases.map(c => c.time_to_hire));
  const minTimeToHire = Math.min(...cases.map(c => c.time_to_hire));

  // Last 6 months trend data (simplified and more focused)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  
  const monthlyData = cases
    .filter(c => new Date(c.created_at) >= sixMonthsAgo)
    .reduce((acc, curr) => {
      const date = new Date(curr.created_at);
      const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
      
      const found = acc.find(item => item.month === monthYear);
      if (found) {
        found.count += 1;
        found.totalDays += curr.time_to_hire;
        found.maxDays = Math.max(found.maxDays, curr.time_to_hire);
      } else {
        acc.push({ 
          month: monthYear, 
          count: 1, 
          totalDays: curr.time_to_hire,
          avgDays: curr.time_to_hire,
          maxDays: curr.time_to_hire
        });
      }
      return acc;
    }, [] as Array<{month: string; count: number; totalDays: number; avgDays: number; maxDays: number}>);
  
  // Calculate average time per month
  monthlyData.forEach(item => {
    item.avgDays = Math.round(item.totalDays / item.count);
  });
  
  // Sort by month chronologically
  monthlyData.sort((a, b) => {
    const [aMonth, aYear] = a.month.split(' ');
    const [bMonth, bYear] = b.month.split(' ');
    return new Date(`${aMonth} 1, ${aYear}`).getTime() - new Date(`${bMonth} 1, ${bYear}`).getTime();
  });

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Time to Hire</CardTitle>
            <Timer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgTimeToHire} days</div>
            <p className="text-xs text-muted-foreground">
              Across all departments
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fastest Hire</CardTitle>
            <ChartLine className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{minTimeToHire} days</div>
            <p className="text-xs text-muted-foreground">
              Best performance
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Longest Hire</CardTitle>
            <HourglassIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{maxTimeToHire} days</div>
            <p className="text-xs text-muted-foreground">
              Needs attention
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Time-to-Hire Trends (Last 6 Months)</CardTitle>
          <CardDescription>Average and maximum days to hire by month</CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={monthlyData}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="month" 
                angle={-45}
                textAnchor="end"
                height={60}
                interval={0}
              />
              <YAxis />
              <Tooltip 
                formatter={(value: number, name: string) => {
                  return [`${value} days`, name === "avgDays" ? "Average" : "Maximum"];
                }}
                labelFormatter={(label) => `Month: ${label}`}
              />
              <Legend />
              <Bar 
                dataKey="avgDays" 
                name="Average Days" 
                fill="#8884d8" 
                radius={[4, 4, 0, 0]}
              />
              <Area
                type="monotone"
                dataKey="maxDays"
                name="Maximum Days"
                fill="#ffc658"
                stroke="#ffc658"
                fillOpacity={0.3}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
