
import { useState } from "react";
import { TimeToHireOverview } from "@/components/dashboard/TimeToHireOverview";
import { ProcessDelaysAnalysis } from "@/components/dashboard/ProcessDelaysAnalysis";
import { DepartmentDelaysAnalysis } from "@/components/dashboard/DepartmentDelaysAnalysis";
import { SurveyInsights } from "@/components/dashboard/SurveyInsights";
import { FilterableTable } from "@/components/dashboard/FilterableTable";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { FilterOptions } from "@/types/hr-types";
import { useHRCases, useHREvents, useHRSurveyResponses, useRecruitmentStageDelays, useFilterOptions } from "@/hooks/use-hr-analytics";

const Index = () => {
  // State for filters
  const [filters, setFilters] = useState<FilterOptions>({
    department: null,
    jobPosition: null,
    status: null,
    timeToHireMin: null,
    timeToHireMax: null
  });

  // Fetch data from Supabase
  const { data: cases = [], isLoading: isLoadingCases } = useHRCases(filters);
  const { data: events = [], isLoading: isLoadingEvents } = useHREvents();
  const { data: surveys = [], isLoading: isLoadingSurveys } = useHRSurveyResponses();
  const { data: stageDelays = [], isLoading: isLoadingDelays } = useRecruitmentStageDelays();
  const { data: filterOptions = { departments: [], jobPositions: [], statuses: [] }, isLoading: isLoadingFilterOptions } = useFilterOptions();

  const isLoading = isLoadingCases || isLoadingEvents || isLoadingSurveys || isLoadingDelays || isLoadingFilterOptions;

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">HR Analytics & Recruitment Delays</h1>
        <p className="text-muted-foreground">
          Interactive dashboard providing insights into hiring pipeline efficiency
        </p>
      </div>
      
      {isLoading ? (
        <div className="flex items-center justify-center h-40">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading dashboard data...</p>
          </div>
        </div>
      ) : (
        <>
          <DashboardHeader cases={cases} events={events} surveys={surveys} />
          
          <TimeToHireOverview cases={cases} />
          
          <div className="grid gap-4 md:grid-cols-2">
            <ProcessDelaysAnalysis delays={stageDelays} />
            <DepartmentDelaysAnalysis cases={cases} delays={stageDelays} />
          </div>
          
          <SurveyInsights surveys={surveys} />
          
          <FilterableTable 
            cases={cases} 
            filterOptions={filterOptions}
            filters={filters}
            setFilters={setFilters}
          />
        </>
      )}
    </div>
  );
};

export default Index;
