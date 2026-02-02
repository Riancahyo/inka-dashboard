import { Database } from './database'

export type Train = Database['public']['Tables']['trains']['Row']
export type TrainInsert = Database['public']['Tables']['trains']['Insert']
export type TrainUpdate = Database['public']['Tables']['trains']['Update']

export interface TrainWithStats extends Train {
  total_laporan?: number
  total_maintenance?: number
  kondisi?: 'Layak' | 'Perbaikan'
}