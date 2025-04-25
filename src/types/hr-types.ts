
export interface HREfficiencyCase {
  id?: number;
  created_at?: string;
  case_id: string | number;
  job_position: string;
  department: string;
  status: string | null;
  hiring_status?: string;
  time_to_hire: number;
  start_date?: string;
  completion_date?: string | null;
  priority?: string;
  applicant_id?: number;
  applicant_name?: string;
  applicant_lastname?: string;
  compliance_check?: boolean;
}

export interface HREfficiencyEvent {
  id?: number;
  created_at?: string;
  event_id: string | number;
  case_id: string | number;
  event_type?: string;
  stage_name?: string;
  stage_order?: number;
  event_date?: string;
  duration_days?: number;
  assignee?: string;
  activity?: string;
  actor?: string;
  department?: string;
  status?: string;
  timestamp?: string;
}

export interface HREfficiencySurveyResponse {
  id?: number;
  created_at?: string;
  response_id: string | number;
  case_id: string | number;
  respondent_type?: string;
  overall_score?: number;
  feedback_text?: string | null;
  sentiment: string | null;
  response_date?: string;
  applicant_id?: number;
  feedback_score?: number;
  comment?: string | null;
}

export interface RecruitmentStageDelay {
  id?: number;
  case_id?: string | number;
  from_stage?: string;
  to_stage?: string;
  avg_delay_days: number;
  department?: string;
  job_position?: string;
  transition_count: number;
  current_stage?: string;
  next_stage?: string;
  max_delay_days?: number;
}

export interface FilterOptions {
  department: string | null;
  jobPosition: string | null;
  status: string | null;
  timeToHireMin: number | null;
  timeToHireMax: number | null;
}
