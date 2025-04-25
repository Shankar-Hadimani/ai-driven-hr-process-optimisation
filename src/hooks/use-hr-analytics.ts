
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
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
        query = query.eq('status', filters.status);
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
      
      return data as HREfficiencyCase[];
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
      
      return data as HREfficiencyEvent[];
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
      
      return data as HREfficiencySurveyResponse[];
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
      
      return data as RecruitmentStageDelay[];
    }
  });
}

export function useFilterOptions() {
  return useQuery({
    queryKey: ['filter-options'],
    queryFn: async () => {
      // Fetch departments
      const { data: departments, error: deptError } = await supabase
        .from('hr_efficiency_cases')
        .select('department')
        .distinct();
      
      if (deptError) {
        console.error('Error fetching departments:', deptError);
        throw deptError;
      }
      
      // Fetch job positions
      const { data: positions, error: posError } = await supabase
        .from('hr_efficiency_cases')
        .select('job_position')
        .distinct();
      
      if (posError) {
        console.error('Error fetching job positions:', posError);
        throw posError;
      }
      
      // Fetch statuses
      const { data: statuses, error: statusError } = await supabase
        .from('hr_efficiency_cases')
        .select('status')
        .distinct();
      
      if (statusError) {
        console.error('Error fetching statuses:', statusError);
        throw statusError;
      }
      
      return {
        departments: departments.map(d => d.department),
        jobPositions: positions.map(p => p.job_position),
        statuses: statuses.map(s => s.status)
      };
    }
  });
}
