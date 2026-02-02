import { Database } from './database'

export type Technician = Database['public']['Tables']['technicians']['Row']
export type TechnicianInsert = Database['public']['Tables']['technicians']['Insert']
export type TechnicianUpdate = Database['public']['Tables']['technicians']['Update']

export interface TechnicianWithActiveReports extends Technician {
  active_reports?: {
    id: string
    train_code: string
    severity: string
  }[]
  total_active?: number
}