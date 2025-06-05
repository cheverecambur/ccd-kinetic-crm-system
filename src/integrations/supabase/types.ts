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
      active_calls: {
        Row: {
          call_type: string | null
          conference_number: string | null
          created_at: string | null
          duration_seconds: number | null
          end_time: string | null
          id: string
          lead_id: number | null
          phone_number: string | null
          recording_id: string | null
          start_time: string | null
          status: string | null
          uniqueid: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          call_type?: string | null
          conference_number?: string | null
          created_at?: string | null
          duration_seconds?: number | null
          end_time?: string | null
          id?: string
          lead_id?: number | null
          phone_number?: string | null
          recording_id?: string | null
          start_time?: string | null
          status?: string | null
          uniqueid?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          call_type?: string | null
          conference_number?: string | null
          created_at?: string | null
          duration_seconds?: number | null
          end_time?: string | null
          id?: string
          lead_id?: number | null
          phone_number?: string | null
          recording_id?: string | null
          start_time?: string | null
          status?: string | null
          uniqueid?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      agent_pauses: {
        Row: {
          comments: string | null
          created_at: string | null
          duration_seconds: number | null
          end_time: string | null
          id: string
          pause_code: string | null
          start_time: string | null
          user_id: string
        }
        Insert: {
          comments?: string | null
          created_at?: string | null
          duration_seconds?: number | null
          end_time?: string | null
          id?: string
          pause_code?: string | null
          start_time?: string | null
          user_id: string
        }
        Update: {
          comments?: string | null
          created_at?: string | null
          duration_seconds?: number | null
          end_time?: string | null
          id?: string
          pause_code?: string | null
          start_time?: string | null
          user_id?: string
        }
        Relationships: []
      }
      agent_sessions: {
        Row: {
          campaign_id: string | null
          conf_exten: string | null
          created_at: string | null
          extension: string | null
          id: string
          is_active: boolean | null
          login_time: string | null
          logout_time: string | null
          phone: string | null
          server_ip: string | null
          session_id: string
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          campaign_id?: string | null
          conf_exten?: string | null
          created_at?: string | null
          extension?: string | null
          id?: string
          is_active?: boolean | null
          login_time?: string | null
          logout_time?: string | null
          phone?: string | null
          server_ip?: string | null
          session_id: string
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          campaign_id?: string | null
          conf_exten?: string | null
          created_at?: string | null
          extension?: string | null
          id?: string
          is_active?: boolean | null
          login_time?: string | null
          logout_time?: string | null
          phone?: string | null
          server_ip?: string | null
          session_id?: string
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      agent_stats: {
        Row: {
          calls_today: number | null
          conversions: number | null
          id: string
          last_call_time: string | null
          leads_contacted: number | null
          pause_time_seconds: number | null
          status: string | null
          talk_time_seconds: number | null
          updated_at: string | null
          user_id: string
          wait_time_seconds: number | null
        }
        Insert: {
          calls_today?: number | null
          conversions?: number | null
          id?: string
          last_call_time?: string | null
          leads_contacted?: number | null
          pause_time_seconds?: number | null
          status?: string | null
          talk_time_seconds?: number | null
          updated_at?: string | null
          user_id: string
          wait_time_seconds?: number | null
        }
        Update: {
          calls_today?: number | null
          conversions?: number | null
          id?: string
          last_call_time?: string | null
          leads_contacted?: number | null
          pause_time_seconds?: number | null
          status?: string | null
          talk_time_seconds?: number | null
          updated_at?: string | null
          user_id?: string
          wait_time_seconds?: number | null
        }
        Relationships: []
      }
      call_logs: {
        Row: {
          call_date: string | null
          campaign_id: string | null
          comments: string | null
          created_at: string | null
          end_epoch: number | null
          id: number
          lead_id: number | null
          length_in_sec: number | null
          list_id: number | null
          phone_code: string | null
          phone_number: string | null
          processed: boolean | null
          start_epoch: number | null
          status: string | null
          term_reason: string | null
          uniqueid: string | null
          user_group: string | null
          user_id: string | null
        }
        Insert: {
          call_date?: string | null
          campaign_id?: string | null
          comments?: string | null
          created_at?: string | null
          end_epoch?: number | null
          id?: number
          lead_id?: number | null
          length_in_sec?: number | null
          list_id?: number | null
          phone_code?: string | null
          phone_number?: string | null
          processed?: boolean | null
          start_epoch?: number | null
          status?: string | null
          term_reason?: string | null
          uniqueid?: string | null
          user_group?: string | null
          user_id?: string | null
        }
        Update: {
          call_date?: string | null
          campaign_id?: string | null
          comments?: string | null
          created_at?: string | null
          end_epoch?: number | null
          id?: number
          lead_id?: number | null
          length_in_sec?: number | null
          list_id?: number | null
          phone_code?: string | null
          phone_number?: string | null
          processed?: boolean | null
          start_epoch?: number | null
          status?: string | null
          term_reason?: string | null
          uniqueid?: string | null
          user_group?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "call_logs_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "call_logs_list_id_fkey"
            columns: ["list_id"]
            isOneToOne: false
            referencedRelation: "lists"
            referencedColumns: ["id"]
          },
        ]
      }
      call_recordings: {
        Row: {
          created_at: string | null
          end_time: string | null
          filename: string | null
          id: string
          lead_id: number | null
          length_seconds: number | null
          location: string | null
          recording_id: string | null
          start_time: string | null
          uniqueid: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          end_time?: string | null
          filename?: string | null
          id?: string
          lead_id?: number | null
          length_seconds?: number | null
          location?: string | null
          recording_id?: string | null
          start_time?: string | null
          uniqueid: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          end_time?: string | null
          filename?: string | null
          id?: string
          lead_id?: number | null
          length_seconds?: number | null
          location?: string | null
          recording_id?: string | null
          start_time?: string | null
          uniqueid?: string
          user_id?: string | null
        }
        Relationships: []
      }
      callbacks: {
        Row: {
          callback_time: string | null
          campaign_id: string | null
          comments: string | null
          completed: boolean | null
          created_at: string | null
          entry_time: string | null
          id: number
          lead_id: number | null
          list_id: number | null
          recipient: string | null
          status: string | null
          user_id: string | null
        }
        Insert: {
          callback_time?: string | null
          campaign_id?: string | null
          comments?: string | null
          completed?: boolean | null
          created_at?: string | null
          entry_time?: string | null
          id?: number
          lead_id?: number | null
          list_id?: number | null
          recipient?: string | null
          status?: string | null
          user_id?: string | null
        }
        Update: {
          callback_time?: string | null
          campaign_id?: string | null
          comments?: string | null
          completed?: boolean | null
          created_at?: string | null
          entry_time?: string | null
          id?: number
          lead_id?: number | null
          list_id?: number | null
          recipient?: string | null
          status?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "callbacks_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "callbacks_list_id_fkey"
            columns: ["list_id"]
            isOneToOne: false
            referencedRelation: "lists"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          active: boolean | null
          category: string | null
          course_code: string
          course_name: string
          created_at: string | null
          description: string | null
          duration_hours: number | null
          id: number
          price: number | null
        }
        Insert: {
          active?: boolean | null
          category?: string | null
          course_code: string
          course_name: string
          created_at?: string | null
          description?: string | null
          duration_hours?: number | null
          id?: number
          price?: number | null
        }
        Update: {
          active?: boolean | null
          category?: string | null
          course_code?: string
          course_name?: string
          created_at?: string | null
          description?: string | null
          duration_hours?: number | null
          id?: number
          price?: number | null
        }
        Relationships: []
      }
      dispositions: {
        Row: {
          active: boolean | null
          category: string | null
          code: string
          created_at: string | null
          description: string | null
          id: number
          name: string
          requires_callback: boolean | null
          requires_comment: boolean | null
          sort_order: number | null
        }
        Insert: {
          active?: boolean | null
          category?: string | null
          code: string
          created_at?: string | null
          description?: string | null
          id?: number
          name: string
          requires_callback?: boolean | null
          requires_comment?: boolean | null
          sort_order?: number | null
        }
        Update: {
          active?: boolean | null
          category?: string | null
          code?: string
          created_at?: string | null
          description?: string | null
          id?: number
          name?: string
          requires_callback?: boolean | null
          requires_comment?: boolean | null
          sort_order?: number | null
        }
        Relationships: []
      }
      interactions: {
        Row: {
          completed_at: string | null
          content: string | null
          created_at: string | null
          direction: string | null
          duration_minutes: number | null
          id: number
          interaction_type: string | null
          lead_id: number | null
          scheduled_at: string | null
          status: string | null
          subject: string | null
          user_id: string | null
        }
        Insert: {
          completed_at?: string | null
          content?: string | null
          created_at?: string | null
          direction?: string | null
          duration_minutes?: number | null
          id?: number
          interaction_type?: string | null
          lead_id?: number | null
          scheduled_at?: string | null
          status?: string | null
          subject?: string | null
          user_id?: string | null
        }
        Update: {
          completed_at?: string | null
          content?: string | null
          created_at?: string | null
          direction?: string | null
          duration_minutes?: number | null
          id?: number
          interaction_type?: string | null
          lead_id?: number | null
          scheduled_at?: string | null
          status?: string | null
          subject?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "interactions_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_sources: {
        Row: {
          active: boolean | null
          api_integration: boolean | null
          cost_per_lead: number | null
          created_at: string | null
          id: number
          source_name: string
          source_type: string | null
          webhook_url: string | null
        }
        Insert: {
          active?: boolean | null
          api_integration?: boolean | null
          cost_per_lead?: number | null
          created_at?: string | null
          id?: number
          source_name: string
          source_type?: string | null
          webhook_url?: string | null
        }
        Update: {
          active?: boolean | null
          api_integration?: boolean | null
          cost_per_lead?: number | null
          created_at?: string | null
          id?: number
          source_name?: string
          source_type?: string | null
          webhook_url?: string | null
        }
        Relationships: []
      }
      leads: {
        Row: {
          acquisition_cost: number | null
          address1: string | null
          address2: string | null
          alt_phone: string | null
          called_count: number | null
          city: string | null
          comments: string | null
          country_code: string | null
          created_at: string | null
          date_of_birth: string | null
          email: string | null
          entry_date: string | null
          first_name: string | null
          gender: string | null
          id: number
          interest_course: string | null
          last_local_call_time: string | null
          last_name: string | null
          lead_quality: string | null
          lead_score: number | null
          list_id: number | null
          middle_initial: string | null
          modify_date: string | null
          owner: string | null
          phone_code: string | null
          phone_number: string
          postal_code: string | null
          source_id: string | null
          state: string | null
          status: string | null
          title: string | null
          updated_at: string | null
          user_id: string | null
          vendor_lead_code: string | null
        }
        Insert: {
          acquisition_cost?: number | null
          address1?: string | null
          address2?: string | null
          alt_phone?: string | null
          called_count?: number | null
          city?: string | null
          comments?: string | null
          country_code?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          email?: string | null
          entry_date?: string | null
          first_name?: string | null
          gender?: string | null
          id?: number
          interest_course?: string | null
          last_local_call_time?: string | null
          last_name?: string | null
          lead_quality?: string | null
          lead_score?: number | null
          list_id?: number | null
          middle_initial?: string | null
          modify_date?: string | null
          owner?: string | null
          phone_code?: string | null
          phone_number: string
          postal_code?: string | null
          source_id?: string | null
          state?: string | null
          status?: string | null
          title?: string | null
          updated_at?: string | null
          user_id?: string | null
          vendor_lead_code?: string | null
        }
        Update: {
          acquisition_cost?: number | null
          address1?: string | null
          address2?: string | null
          alt_phone?: string | null
          called_count?: number | null
          city?: string | null
          comments?: string | null
          country_code?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          email?: string | null
          entry_date?: string | null
          first_name?: string | null
          gender?: string | null
          id?: number
          interest_course?: string | null
          last_local_call_time?: string | null
          last_name?: string | null
          lead_quality?: string | null
          lead_score?: number | null
          list_id?: number | null
          middle_initial?: string | null
          modify_date?: string | null
          owner?: string | null
          phone_code?: string | null
          phone_number?: string
          postal_code?: string | null
          source_id?: string | null
          state?: string | null
          status?: string | null
          title?: string | null
          updated_at?: string | null
          user_id?: string | null
          vendor_lead_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leads_list_id_fkey"
            columns: ["list_id"]
            isOneToOne: false
            referencedRelation: "lists"
            referencedColumns: ["id"]
          },
        ]
      }
      lists: {
        Row: {
          active: boolean | null
          campaign_id: string | null
          created_at: string | null
          id: number
          list_description: string | null
          list_name: string
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          campaign_id?: string | null
          created_at?: string | null
          id?: number
          list_description?: string | null
          list_name: string
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          campaign_id?: string | null
          created_at?: string | null
          id?: number
          list_description?: string | null
          list_name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      users: {
        Row: {
          active: boolean | null
          created_at: string | null
          email: string | null
          extension: string | null
          first_name: string | null
          id: number
          last_login: string | null
          last_name: string | null
          phone: string | null
          role: string | null
          updated_at: string | null
          user_group: string | null
          user_id: string
          vicidial_active: boolean | null
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          email?: string | null
          extension?: string | null
          first_name?: string | null
          id?: number
          last_login?: string | null
          last_name?: string | null
          phone?: string | null
          role?: string | null
          updated_at?: string | null
          user_group?: string | null
          user_id: string
          vicidial_active?: boolean | null
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          email?: string | null
          extension?: string | null
          first_name?: string | null
          id?: number
          last_login?: string | null
          last_name?: string | null
          phone?: string | null
          role?: string | null
          updated_at?: string | null
          user_group?: string | null
          user_id?: string
          vicidial_active?: boolean | null
        }
        Relationships: []
      }
      vicidial_settings: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          setting_key: string
          setting_value: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          setting_key: string
          setting_value?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          setting_key?: string
          setting_value?: string | null
          updated_at?: string | null
        }
        Relationships: []
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
