import { Database } from './database'

export type Laporan = Database['public']['Tables']['crash_report']['Row']
export type LaporanInsert = Database['public']['Tables']['crash_report']['Insert']
export type LaporanUpdate = Database['public']['Tables']['crash_report']['Update']

export interface LaporanWithTrain extends Laporan {
  trains: {
    train_code: string
    name: string
  }
}

export interface LaporanWithDetails extends Laporan {
  trains: {
    train_code: string
    name: string
    type: string
  }
  technicians?: {
    name: string
    expertise: string
  } | null
}