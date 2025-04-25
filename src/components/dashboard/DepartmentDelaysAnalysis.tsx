
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { HREfficiencyCase, RecruitmentStageDelay } from "@/types/hr-types";

interface DepartmentDelaysAnalysisProps {
  cases: HREfficiencyCase[];
  delays: RecruitmentStageDelay[];
}

export function DepartmentDelaysAnalysis({ cases, delays }: DepartmentDelaysAnalysisProps) {
  // Prepare data for department delays
  const departmentData = cases.reduce((acc, curr) => {
    const found = acc.find(item => item.name === curr.department);
    if (found) {
      found.count += 1;
      found.totalDays += curr.time_to_hire;
    } else {
      acc.push({ 
        name: curr.department, 
        count: 1, 
        totalDays: curr.time_to_hire,
        avgTimeToHire: curr.time_to_hire,
        avgProcessDelay: 0
      });
    }
    return acc;
  }, [] as Array<{
    name: string;
    count: number;
    totalDays: number;
    avgTimeToHire: number;
    avgProcessDelay: number;
  }>);
  
  // Calculate average time-to-hire per department
  departmentData.forEach(item => {
    item.avgTimeToHire = Math.round(item.totalDays / item.count);
  });
  
  // Calculate average process delays per department
  delays.forEach(delay => {
    const department = departmentData.find(d => d.name === delay.department);
    if (department) {
      // Accumulate weighted average delays
      department.avgProcessDelay += delay.avg_delay_days * delay.transition_count;
    }
  });
  
  // Normalize the process delay values
  departmentData.forEach(dept => {
    // Calculate a normalized value based on transitions
    const totalTransitions = delays
      .filter(d => d.department === dept.name)
      .reduce((sum, d) => sum + d.transition_count, 0);
    
    dept.avgProcessDelay = totalTransitions > 0 
      ? Math.round(dept.avgProcessDelay / totalTransitions) 
      : 0;
  });
  
  // Sort by average time-to-hire (descending)
  departmentData.sort((a, b) => b.avgTimeToHire - a.avgTimeToHire);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Delays by Department</CardTitle>
        <CardDescription>Comparison of time-to-hire and process delays by department</CardDescription>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={departmentData}
            margin={{ top: 20, right: 30, left: 70, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip 
              formatter={(value: number, name: string) => [
                `${value} days`, 
                name === 'avgTimeToHire' ? 'Avg Time-to-Hire' : 'Avg Process Delay'
              ]}
              labelFormatter={(label) => `Department: ${label}`}
            />
            <Legend />
            <Bar 
              dataKey="avgTimeToHire" 
              name="Avg Time-to-Hire" 
              fill="#3498db" 
            />
            <Bar 
              dataKey="avgProcessDelay" 
              name="Avg Process Delay" 
              fill="#e67e22" 
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
