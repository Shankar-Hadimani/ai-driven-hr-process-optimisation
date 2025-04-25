
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { FilterOptions, HREfficiencyCase, HREfficiencyEvent, HREfficiencySurveyResponse, RecruitmentStageDelay } from '@/types/hr-types';

export function useHRCases(filters: FilterOptions) {
  return useQuery({
    queryKey: ['hr-cases', filters],
    queryFn: async () => {
      let query = supabase
        .from('hr_efficiency_cases')
        .select('*');
      
      if (filters.department) {
        query = query.eq('department', filters.department);
      }
      
      if (filters.jobPosition) {
        query = query.eq('job_position', filters.jobPosition);
      }
      
      if (filters.status) {
        query = query.eq('hiring_status', filters.status); // Using hiring_status instead of status
      }
      
      if (filters.timeToHireMin !== null) {
        query = query.gte('time_to_hire', filters.timeToHireMin);
      }
      
      if (filters.timeToHireMax !== null) {
        query = query.lte('time_to_hire', filters.timeToHireMax);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching HR cases:', error);
        throw error;
      }
      
      // Map the response data to match our interface
      const transformedData = data.map((item: any) => ({
        ...item,
        status: item.hiring_status, // Map hiring_status to status for compatibility
        case_id: item.case_id.toString(), // Ensure case_id is a string
      })) as HREfficiencyCase[];
      
      return transformedData;
    }
  });
}

export function useHREvents() {
  return useQuery({
    queryKey: ['hr-events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hr_efficiency_events')
        .select('*');
      
      if (error) {
        console.error('Error fetching HR events:', error);
        throw error;
      }
      
      // Map the response data to match our interface
      const transformedData = data.map((item: any) => ({
        ...item,
        event_id: item.event_id.toString(),
        case_id: item.case_id?.toString(), // Ensure case_id is a string
        event_type: item.activity || '', // Map activity to event_type for compatibility
        stage_name: item.status || '', // Map status to stage_name for compatibility
        event_date: item.timestamp
      })) as HREfficiencyEvent[];
      
      return transformedData;
    }
  });
}

export function useHRSurveyResponses() {
  return useQuery({
    queryKey: ['hr-surveys'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hr_efficiency_survey_responses')
        .select('*');
      
      if (error) {
        console.error('Error fetching HR survey responses:', error);
        throw error;
      }
      
      // Map the response data to match our interface
      const transformedData = data.map((item: any) => ({
        ...item,
        response_id: item.response_id.toString(),
        case_id: item.case_id?.toString(),
        overall_score: item.feedback_score,
        feedback_text: item.comment
      })) as HREfficiencySurveyResponse[];
      
      return transformedData;
    }
  });
}

export function useRecruitmentStageDelays() {
  return useQuery({
    queryKey: ['stage-delays'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vw_recruitment_stage_delays')
        .select('*');
      
      if (error) {
        console.error('Error fetching recruitment stage delays:', error);
        throw error;
      }
      
      // Map the response data to match our interface
      const transformedData = data.map((item: any) => ({
        ...item,
        case_id: item.case_id?.toString(),
        from_stage: item.current_stage,
        to_stage: item.next_stage
      })) as RecruitmentStageDelay[];
      
      return transformedData;
    }
  });
}

export function useFilterOptions() {
  return useQuery({
    queryKey: ['filter-options'],
    queryFn: async () => {
      try {
        // Fetch all cases first
        const { data: allCases, error: casesError } = await supabase
          .from('hr_efficiency_cases')
          .select('department, job_position, hiring_status');
        
        if (casesError) {
          console.error('Error fetching filter options:', casesError);
          throw casesError;
        }
        
        if (!allCases) {
          throw new Error('No data returned from filter options query');
        }
        
        // Extract unique values using JavaScript instead of database distinct
        const departments = Array.from(new Set(allCases.map(c => c.department).filter(Boolean)));
        const jobPositions = Array.from(new Set(allCases.map(c => c.job_position).filter(Boolean)));
        const statuses = Array.from(new Set(allCases.map(c => c.hiring_status).filter(Boolean)));
        
        return {
          departments,
          jobPositions,
          statuses
        };
      } catch (error) {
        console.error('Error in useFilterOptions:', error);
        throw error;
      }
    }
  });
}
