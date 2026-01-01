export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      api_usage_tracking: {
        Row: {
          created_at: string
          estimated_cost_cents: number
          function_name: string
          id: string
          input_tokens: number
          output_tokens: number
          total_tokens: number
          user_id: string
        }
        Insert: {
          created_at?: string
          estimated_cost_cents?: number
          function_name: string
          id?: string
          input_tokens?: number
          output_tokens?: number
          total_tokens?: number
          user_id: string
        }
        Update: {
          created_at?: string
          estimated_cost_cents?: number
          function_name?: string
          id?: string
          input_tokens?: number
          output_tokens?: number
          total_tokens?: number
          user_id?: string
        }
        Relationships: []
      }
      deck_generation_jobs: {
        Row: {
          client_name: string | null
          completed_at: string | null
          created_at: string
          deck_prompt: string | null
          error_message: string | null
          id: string
          manus_task_id: string | null
          num_slides: number | null
          progress: number | null
          proposal_id: string | null
          queue_position: number | null
          result_url: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          client_name?: string | null
          completed_at?: string | null
          created_at?: string
          deck_prompt?: string | null
          error_message?: string | null
          id?: string
          manus_task_id?: string | null
          num_slides?: number | null
          progress?: number | null
          proposal_id?: string | null
          queue_position?: number | null
          result_url?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          client_name?: string | null
          completed_at?: string | null
          created_at?: string
          deck_prompt?: string | null
          error_message?: string | null
          id?: string
          manus_task_id?: string | null
          num_slides?: number | null
          progress?: number | null
          proposal_id?: string | null
          queue_position?: number | null
          result_url?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "deck_generation_jobs_proposal_id_fkey"
            columns: ["proposal_id"]
            isOneToOne: false
            referencedRelation: "proposals"
            referencedColumns: ["id"]
          },
        ]
      }
      dm_snapshots: {
        Row: {
          analysis: Json
          created_at: string | null
          id: string
          lead_id: string
          response_used: string | null
        }
        Insert: {
          analysis: Json
          created_at?: string | null
          id?: string
          lead_id: string
          response_used?: string | null
        }
        Update: {
          analysis?: Json
          created_at?: string | null
          id?: string
          lead_id?: string
          response_used?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dm_snapshots_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          budget_range: string | null
          created_at: string | null
          current_stage: string | null
          goals: string | null
          id: string
          last_activity: string | null
          name: string
          pain_points: string[] | null
          platform: string | null
          proposal_id: string | null
          qualification_score: number | null
          status: string | null
          timeline: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          budget_range?: string | null
          created_at?: string | null
          current_stage?: string | null
          goals?: string | null
          id?: string
          last_activity?: string | null
          name: string
          pain_points?: string[] | null
          platform?: string | null
          proposal_id?: string | null
          qualification_score?: number | null
          status?: string | null
          timeline?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          budget_range?: string | null
          created_at?: string | null
          current_stage?: string | null
          goals?: string | null
          id?: string
          last_activity?: string | null
          name?: string
          pain_points?: string[] | null
          platform?: string | null
          proposal_id?: string | null
          qualification_score?: number | null
          status?: string | null
          timeline?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "leads_proposal_id_fkey"
            columns: ["proposal_id"]
            isOneToOne: false
            referencedRelation: "proposals"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          background: string | null
          business_context: string | null
          company_name: string | null
          created_at: string
          email: string | null
          id: string
          proof_points: string | null
          updated_at: string
        }
        Insert: {
          background?: string | null
          business_context?: string | null
          company_name?: string | null
          created_at?: string
          email?: string | null
          id: string
          proof_points?: string | null
          updated_at?: string
        }
        Update: {
          background?: string | null
          business_context?: string | null
          company_name?: string | null
          created_at?: string
          email?: string | null
          id?: string
          proof_points?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      proposal_drafts: {
        Row: {
          background: string | null
          business_type: string | null
          client_context: string | null
          client_name: string | null
          created_at: string
          custom_business_type: string | null
          id: string
          last_saved_at: string
          pricing_tiers: Json | null
          proposal_length: string | null
          selected_case_studies: string[] | null
          user_id: string
        }
        Insert: {
          background?: string | null
          business_type?: string | null
          client_context?: string | null
          client_name?: string | null
          created_at?: string
          custom_business_type?: string | null
          id?: string
          last_saved_at?: string
          pricing_tiers?: Json | null
          proposal_length?: string | null
          selected_case_studies?: string[] | null
          user_id: string
        }
        Update: {
          background?: string | null
          business_type?: string | null
          client_context?: string | null
          client_name?: string | null
          created_at?: string
          custom_business_type?: string | null
          id?: string
          last_saved_at?: string
          pricing_tiers?: Json | null
          proposal_length?: string | null
          selected_case_studies?: string[] | null
          user_id?: string
        }
        Relationships: []
      }
      proposal_usage: {
        Row: {
          created_at: string
          id: string
          ip_address: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          ip_address?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          ip_address?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      proposals: {
        Row: {
          budget_max: number | null
          budget_min: number | null
          case_studies: string[] | null
          client_name: string | null
          contract: string | null
          contract_email: string | null
          created_at: string
          deck_prompt: string | null
          deck_url: string | null
          id: string
          invoice_description: string | null
          project_context: string | null
          proposal: string | null
          proposal_email: string | null
          proposal_length: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          budget_max?: number | null
          budget_min?: number | null
          case_studies?: string[] | null
          client_name?: string | null
          contract?: string | null
          contract_email?: string | null
          created_at?: string
          deck_prompt?: string | null
          deck_url?: string | null
          id?: string
          invoice_description?: string | null
          project_context?: string | null
          proposal?: string | null
          proposal_email?: string | null
          proposal_length?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          budget_max?: number | null
          budget_min?: number | null
          case_studies?: string[] | null
          client_name?: string | null
          contract?: string | null
          contract_email?: string | null
          created_at?: string
          deck_prompt?: string | null
          deck_url?: string | null
          id?: string
          invoice_description?: string | null
          project_context?: string | null
          proposal?: string | null
          proposal_email?: string | null
          proposal_length?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_subscriptions: {
        Row: {
          created_at: string
          current_period_end: string | null
          extra_proposals_purchased: number | null
          id: string
          status: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          subscription_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_period_end?: string | null
          extra_proposals_purchased?: number | null
          id?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_period_end?: string | null
          extra_proposals_purchased?: number | null
          id?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_deck_queue_position: { Args: { job_id: string }; Returns: number }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
