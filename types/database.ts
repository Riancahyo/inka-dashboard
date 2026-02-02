export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      trains: {
        Row: {
          id: string
          train_code: string
          name: string
          type: string
          year: number
          created_at: string
        }
        Insert: {
          id?: string
          train_code: string
          name: string
          type: string
          year: number
          created_at?: string
        }
        Update: {
          id?: string
          train_code?: string
          name?: string
          type?: string
          year?: number
          created_at?: string
        }
      }
      productions: {
        Row: {
          id: string
          train_id: string
          progress: number
          status: string
          start_date: string | null
          estimated_completion_date: string | null
          actual_completion_date: string | null
          created_at: string
        }
        Insert: {
          id?: string
          train_id: string
          progress?: number
          status: string
          start_date?: string | null
          estimated_completion_date?: string | null
          actual_completion_date?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          train_id?: string
          progress?: number
          status?: string
          start_date?: string | null
          estimated_completion_date?: string | null
          actual_completion_date?: string | null
        }
      }
      maintenance: {
        Row: {
          id: string
          train_id: string
          maintenance_type: string
          urgency: string
          status: string
          schedule_date: string
          created_at: string
        }
        Insert: {
          id?: string
          train_id: string
          maintenance_type: string
          urgency: string
          status: string
          schedule_date: string
          created_at?: string
        }
        Update: {
          id?: string
          train_id?: string
          maintenance_type?: string
          urgency?: string
          status?: string
          schedule_date?: string
        }
      }
      inspections: {
        Row: {
          id: string
          train_id: string
          risk_level: string
          inspector: string
          date: string
          created_at: string
        }
        Insert: {
          id?: string
          train_id: string
          risk_level: string
          inspector: string
          date: string
          created_at?: string
        }
        Update: {
          id?: string
          train_id?: string
          risk_level?: string
          inspector?: string
          date?: string
        }
      }
      technicians: {
        Row: {
          id: string
          name: string
          expertise: string
          contact: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          expertise: string
          contact: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          expertise?: string
          contact?: string
        }
      }
      crash_report: {
        Row: {
          id: string
          train_id: string
          technician_id: string | null
          severity: string
          status: string
          description: string
          photo_url: string | null
          reported_date: string
          created_at: string
        }
        Insert: {
          id?: string
          train_id: string
          technician_id?: string | null
          severity: string
          status: string
          description: string
          photo_url?: string | null
          reported_date: string
          created_at?: string
        }
        Update: {
          id?: string
          train_id?: string
          technician_id?: string | null
          severity?: string
          status?: string
          description?: string
          photo_url?: string | null
          reported_date?: string
        }
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
  }
}