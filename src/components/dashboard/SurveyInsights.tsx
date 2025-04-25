
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { HREfficiencySurveyResponse } from "@/types/hr-types";

interface SurveyInsightsProps {
  surveys: HREfficiencySurveyResponse[];
}

export function SurveyInsights({ surveys }: SurveyInsightsProps) {
  // Count sentiment distributions
  const sentimentCounts = {
    positive: surveys.filter(s => s.sentiment === 'positive').length,
    neutral: surveys.filter(s => s.sentiment === 'neutral').length,
    negative: surveys.filter(s => s.sentiment === 'negative').length
  };
  
  const sentimentData = [
    { name: 'Positive', value: sentimentCounts.positive },
    { name: 'Neutral', value: sentimentCounts.neutral },
    { name: 'Negative', value: sentimentCounts.negative }
  ];
  
  const SENTIMENT_COLORS = {
    Positive: '#2ecc71',
    Neutral: '#f1c40f',
    Negative: '#e74c3c'
  };

  // Calculate average scores by respondent type
  const respondentTypeData = surveys.reduce((acc, curr) => {
    const found = acc.find(item => item.name === curr.respondent_type);
    if (found) {
      found.count += 1;
      found.totalScore += curr.overall_score;
    } else {
      acc.push({
        name: curr.respondent_type,
        count: 1,
        totalScore: curr.overall_score,
        avgScore: curr.overall_score
      });
    }
    return acc;
  }, [] as Array<{
    name: string;
    count: number;
    totalScore: number;
    avgScore: number;
  }>);
  
  // Calculate average scores
  respondentTypeData.forEach(item => {
    item.avgScore = +(item.totalScore / item.count).toFixed(1);
  });
  
  // Sort by average score (descending)
  respondentTypeData.sort((a, b) => b.avgScore - a.avgScore);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Feedback Sentiment Distribution</CardTitle>
          <CardDescription>Overall sentiment from survey responses</CardDescription>
        </CardHeader>
        <CardContent className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={sentimentData}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {sentimentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={SENTIMENT_COLORS[entry.name as keyof typeof SENTIMENT_COLORS]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number, name: string) => [value, name]}
                labelFormatter={() => 'Sentiment'}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Feedback Scores by Respondent Type</CardTitle>
          <CardDescription>Average survey scores (scale 1-10)</CardDescription>
        </CardHeader>
        <CardContent className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={respondentTypeData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 10]} />
              <Tooltip 
                formatter={(value: number) => [`${value.toFixed(1)}`, 'Avg Score']}
              />
              <Legend />
              <Bar 
                dataKey="avgScore" 
                name="Average Score" 
                fill="#9b59b6" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
