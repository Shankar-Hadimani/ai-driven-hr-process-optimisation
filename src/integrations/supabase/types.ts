export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      hr_efficiency_cases: {
        Row: {
          applicant_id: number | null
          applicant_lastname: string | null
          applicant_name: string | null
          case_id: number
          compliance_check: boolean | null
          department: string | null
          hiring_status: string | null
          job_position: string | null
          time_to_hire: number | null
        }
        Insert: {
          applicant_id?: number | null
          applicant_lastname?: string | null
          applicant_name?: string | null
          case_id: number
          compliance_check?: boolean | null
          department?: string | null
          hiring_status?: string | null
          job_position?: string | null
          time_to_hire?: number | null
        }
        Update: {
          applicant_id?: number | null
          applicant_lastname?: string | null
          applicant_name?: string | null
          case_id?: number
          compliance_check?: boolean | null
          department?: string | null
          hiring_status?: string | null
          job_position?: string | null
          time_to_hire?: number | null
        }
        Relationships: []
      }
      hr_efficiency_events: {
        Row: {
          activity: string | null
          actor: string | null
          case_id: number | null
          department: string | null
          event_id: number
          status: string | null
          timestamp: string | null
        }
        Insert: {
          activity?: string | null
          actor?: string | null
          case_id?: number | null
          department?: string | null
          event_id: number
          status?: string | null
          timestamp?: string | null
        }
        Update: {
          activity?: string | null
          actor?: string | null
          case_id?: number | null
          department?: string | null
          event_id?: number
          status?: string | null
          timestamp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hr_efficiency_events_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "hr_efficiency_cases"
            referencedColumns: ["case_id"]
          },
        ]
      }
      hr_efficiency_survey_responses: {
        Row: {
          applicant_id: number | null
          case_id: number | null
          comment: string | null
          feedback_score: number | null
          response_id: number
          sentiment: string | null
        }
        Insert: {
          applicant_id?: number | null
          case_id?: number | null
          comment?: string | null
          feedback_score?: number | null
          response_id: number
          sentiment?: string | null
        }
        Update: {
          applicant_id?: number | null
          case_id?: number | null
          comment?: string | null
          feedback_score?: number | null
          response_id?: number
          sentiment?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hr_efficiency_survey_responses_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "hr_efficiency_cases"
            referencedColumns: ["case_id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
