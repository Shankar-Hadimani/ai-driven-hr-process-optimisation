
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
        id: item.id || item.case_id, // Use case_id as fallback for id
        created_at: item.created_at || new Date().toISOString(),
        status: item.hiring_status, // Map hiring_status to status for compatibility
        case_id: item.case_id.toString(), // Ensure case_id is a string
        start_date: item.start_date || null,
        completion_date: item.completion_date || null,
        priority: item.priority || null
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
        id: item.id || item.event_id,
        created_at: item.created_at || new Date().toISOString(),
        event_id: item.event_id.toString(),
        case_id: item.case_id?.toString(), // Ensure case_id is a string
        event_type: item.activity || '', // Map activity to event_type for compatibility
        stage_name: item.status || '', // Map status to stage_name for compatibility
        event_date: item.timestamp,
        duration_days: item.duration_days || null,
        stage_order: item.stage_order || null
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
        id: item.id || item.response_id,
        created_at: item.created_at || new Date().toISOString(),
        response_id: item.response_id.toString(),
        case_id: item.case_id?.toString(),
        overall_score: item.feedback_score,
        feedback_text: item.comment,
        respondent_type: item.respondent_type || null,
        response_date: item.response_date || new Date().toISOString(),
      })) as HREfficiencySurveyResponse[];
      
      return transformedData;
    }
  });
}

export function useRecruitmentStageDelays() {
  return useQuery({
    queryKey: ['stage-delays'],
    queryFn: async () => {
      try {
        // Since the view doesn't exist, we'll create a mock implementation using existing tables
        // This is a temporary solution until the actual view is created in the database
        const { data: events, error: eventsError } = await supabase
          .from('hr_efficiency_events')
          .select('*');
          
        if (eventsError) {
          console.error('Error fetching events for delays:', eventsError);
          throw eventsError;
        }
        
        // Process the events to simulate the stage delay data
        // This is just a placeholder implementation
        const mockDelayData = events.reduce((acc: any[], event: any, index: number, arr: any[]) => {
          if (index === 0) return acc;
          
          // Group by case_id and calculate transitions between statuses
          const prevEvent = arr[index - 1];
          if (prevEvent.case_id === event.case_id && prevEvent.status !== event.status) {
            const timestamp1 = new Date(prevEvent.timestamp || '');
            const timestamp2 = new Date(event.timestamp || '');
            const delayDays = Math.max(0, Math.round((timestamp2.getTime() - timestamp1.getTime()) / (1000 * 60 * 60 * 24)));
            
            acc.push({
              id: `${prevEvent.event_id}-${event.event_id}`,
              case_id: event.case_id.toString(),
              from_stage: prevEvent.status || '',
              to_stage: event.status || '',
              avg_delay_days: delayDays,
              current_stage: prevEvent.status || '',
              next_stage: event.status || '',
              max_delay_days: delayDays,
              transition_count: 1,
              department: event.department || '',
              job_position: ''  // We don't have this in events, would need to join with cases
            });
          }
          return acc;
        }, []);
        
        return mockDelayData as RecruitmentStageDelay[];
      } catch (error) {
        console.error('Error in stage delays query:', error);
        // Return empty array as fallback
        return [] as RecruitmentStageDelay[];
      }
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
