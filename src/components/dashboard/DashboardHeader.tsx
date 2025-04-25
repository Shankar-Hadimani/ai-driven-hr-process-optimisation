
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { HREfficiencyCase, HREfficiencyEvent, HREfficiencySurveyResponse } from "@/types/hr-types";

interface DashboardHeaderProps {
  cases: HREfficiencyCase[];
  events: HREfficiencyEvent[];
  surveys: HREfficiencySurveyResponse[];
}

export function DashboardHeader({ cases, events, surveys }: DashboardHeaderProps) {
  // Calculate high-level metrics
  const totalCases = cases.length;
  const completedCases = cases.filter(c => c.status === 'Completed').length;
  const avgTimeToHire = cases.length > 0 
    ? Math.round(cases.reduce((sum, c) => sum + c.time_to_hire, 0) / cases.length) 
    : 0;
  
  const totalStages = events.length;
  
  const avgSatisfactionScore = surveys.length > 0
    ? Math.round(surveys.reduce((sum, s) => sum + s.overall_score, 0) / surveys.length * 10) / 10
    : 0;
  
  // Calculate completion rate
  const completionRate = totalCases > 0 
    ? Math.round((completedCases / totalCases) * 100) 
    : 0;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Recruitment Cases
          </CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalCases}</div>
          <p className="text-xs text-muted-foreground">
            {completedCases} completed ({completionRate}%)
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Avg. Time to Hire
          </CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{avgTimeToHire} days</div>
          <p className="text-xs text-muted-foreground">
            Across all completed cases
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Process Stages
          </CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <rect width="20" height="14" x="2" y="5" rx="2" />
            <path d="M2 10h20" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalStages}</div>
          <p className="text-xs text-muted-foreground">
            Across {totalCases} recruitment cases
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Avg. Satisfaction Score
          </CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{avgSatisfactionScore}/10</div>
          <p className="text-xs text-muted-foreground">
            From {surveys.length} survey responses
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
