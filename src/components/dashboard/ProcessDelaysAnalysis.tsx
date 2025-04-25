
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { RecruitmentStageDelay } from "@/types/hr-types";

interface ProcessDelaysAnalysisProps {
  delays: RecruitmentStageDelay[];
}

export function ProcessDelaysAnalysis({ delays }: ProcessDelaysAnalysisProps) {
  // Prepare data for stage transition delays
  const stageTransitionData = delays.reduce((acc, curr) => {
    const transitionName = `${curr.from_stage} → ${curr.to_stage}`;
    const found = acc.find(item => item.name === transitionName);
    
    if (found) {
      found.value = (found.value * found.count + curr.avg_delay_days * curr.transition_count) / 
                    (found.count + curr.transition_count);
      found.count += curr.transition_count;
    } else {
      acc.push({ 
        name: transitionName, 
        value: curr.avg_delay_days,
        count: curr.transition_count,
        fromStage: curr.from_stage,
        toStage: curr.to_stage
      });
    }
    return acc;
  }, [] as Array<{
    name: string; 
    value: number; 
    count: number;
    fromStage: string;
    toStage: string;
  }>);
  
  // Sort by average delay (descending)
  stageTransitionData.sort((a, b) => b.value - a.value);
  
  // Top 10 longest delays
  const top10Delays = stageTransitionData.slice(0, 10);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hiring Process Delays</CardTitle>
        <CardDescription>Average delays between recruitment stages (in days)</CardDescription>
      </CardHeader>
      <CardContent className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={top10Delays}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 120, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis 
              type="category" 
              dataKey="name" 
              tick={{ fontSize: 12 }}
              width={120}
            />
            <Tooltip 
              formatter={(value: number) => [`${value.toFixed(1)} days`, 'Avg Delay']}
              labelFormatter={(label) => `Stage Transition: ${label}`}
            />
            <Legend />
            <Bar 
              dataKey="value" 
              name="Average Delay (days)" 
              fill="#e74c3c"
              radius={[0, 4, 4, 0]} 
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
