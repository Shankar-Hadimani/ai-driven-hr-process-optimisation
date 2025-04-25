
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { HREfficiencyCase } from "@/types/hr-types";

interface TimeToHireOverviewProps {
  cases: HREfficiencyCase[];
}

export function TimeToHireOverview({ cases }: TimeToHireOverviewProps) {
  // Calculate average time-to-hire
  const avgTimeToHire = cases.length > 0 
    ? Math.round(cases.reduce((sum, c) => sum + c.time_to_hire, 0) / cases.length) 
    : 0;

  // Prepare data for the job position chart
  const jobPositionData = cases.reduce((acc, curr) => {
    const found = acc.find(item => item.name === curr.job_position);
    if (found) {
      found.value += 1;
      found.totalDays += curr.time_to_hire;
    } else {
      acc.push({ 
        name: curr.job_position, 
        value: 1, 
        totalDays: curr.time_to_hire,
        avgDays: curr.time_to_hire
      });
    }
    return acc;
  }, [] as Array<{name: string; value: number; totalDays: number; avgDays: number}>);
  
  // Calculate average time per job position
  jobPositionData.forEach(item => {
    item.avgDays = Math.round(item.totalDays / item.value);
  });

  // Sort by average days
  jobPositionData.sort((a, b) => b.avgDays - a.avgDays);
  
  // Prepare data for department chart
  const departmentData = cases.reduce((acc, curr) => {
    const found = acc.find(item => item.name === curr.department);
    if (found) {
      found.value += 1;
      found.totalDays += curr.time_to_hire;
    } else {
      acc.push({ 
        name: curr.department, 
        value: 1, 
        totalDays: curr.time_to_hire,
        avgDays: curr.time_to_hire
      });
    }
    return acc;
  }, [] as Array<{name: string; value: number; totalDays: number; avgDays: number}>);
  
  // Calculate average time per department
  departmentData.forEach(item => {
    item.avgDays = Math.round(item.totalDays / item.value);
  });
  
  // Sort by average days
  departmentData.sort((a, b) => b.avgDays - a.avgDays);

  // Prepare trend data (last 6 months)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  
  const monthlyData = cases
    .filter(c => new Date(c.created_at) >= sixMonthsAgo)
    .reduce((acc, curr) => {
      const date = new Date(curr.created_at);
      const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
      
      const found = acc.find(item => item.month === monthYear);
      if (found) {
        found.count += 1;
        found.totalDays += curr.time_to_hire;
      } else {
        acc.push({ 
          month: monthYear, 
          count: 1, 
          totalDays: curr.time_to_hire,
          avgDays: curr.time_to_hire
        });
      }
      return acc;
    }, [] as Array<{month: string; count: number; totalDays: number; avgDays: number}>);
  
  // Calculate average time per month
  monthlyData.forEach(item => {
    item.avgDays = Math.round(item.totalDays / item.count);
  });
  
  // Sort by month chronologically
  monthlyData.sort((a, b) => {
    const [aMonth, aYear] = a.month.split('/').map(Number);
    const [bMonth, bYear] = b.month.split('/').map(Number);
    return (aYear * 12 + aMonth) - (bYear * 12 + bMonth);
  });

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Time-to-Hire Overview</CardTitle>
          <CardDescription>
            Overall average time-to-hire: <span className="font-bold text-dashboard-blue">{avgTimeToHire} days</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={monthlyData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip 
                formatter={(value: number) => [`${value} days`, 'Avg Time-to-Hire']}
                labelFormatter={(label) => `Month: ${label}`}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="avgDays" 
                name="Avg Time to Hire" 
                stroke="#3498db" 
                activeDot={{ r: 8 }}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Time-to-Hire by Job Position</CardTitle>
          <CardDescription>Average days to hire for each position</CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={jobPositionData.slice(0, 10)}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis 
                type="category" 
                dataKey="name" 
                tick={{ fontSize: 12 }}
                width={80}
              />
              <Tooltip 
                formatter={(value: number) => [`${value} days`, 'Avg Time-to-Hire']}
              />
              <Bar dataKey="avgDays" name="Average Days" fill="#1abc9c" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Time-to-Hire by Department</CardTitle>
          <CardDescription>Average days to hire for each department</CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={departmentData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis 
                type="category" 
                dataKey="name" 
                tick={{ fontSize: 12 }}
                width={80}
              />
              <Tooltip 
                formatter={(value: number) => [`${value} days`, 'Avg Time-to-Hire']}
              />
              <Bar dataKey="avgDays" name="Average Days" fill="#9b59b6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
