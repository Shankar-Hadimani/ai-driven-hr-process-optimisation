
export interface HREfficiencyCase {
  id: number;
  created_at: string;
  case_id: string;
  job_position: string;
  department: string;
  status: string;
  time_to_hire: number; // days
  start_date: string;
  completion_date: string | null;
  priority: string;
}

export interface HREfficiencyEvent {
  id: number;
  created_at: string;
  event_id: string;
  case_id: string;
  event_type: string;
  stage_name: string;
  stage_order: number;
  event_date: string;
  duration_days: number;
  assignee: string;
}

export interface HREfficiencySurveyResponse {
  id: number;
  created_at: string;
  response_id: string;
  case_id: string;
  respondent_type: string;
  overall_score: number;
  feedback_text: string | null;
  sentiment: 'positive' | 'neutral' | 'negative';
  response_date: string;
}

export interface RecruitmentStageDelay {
  id: number;
  case_id: string;
  from_stage: string;
  to_stage: string;
  avg_delay_days: number;
  department: string;
  job_position: string;
  transition_count: number;
}

export interface FilterOptions {
  department: string | null;
  jobPosition: string | null;
  status: string | null;
  timeToHireMin: number | null;
  timeToHireMax: number | null;
}
