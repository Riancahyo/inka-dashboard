import { supabase } from '@/lib/supabase'
import { LaporanInsert, LaporanUpdate } from '@/types/laporan'

export interface LaporanWithDetails {
  id: string
  severity: string
  status: string
  description: string
  photo_url: string | null
  reported_date: string
  created_at: string
  train_id: string
  technician_id: string | null
  trains: {
    train_code: string
    name: string
    type: string
    year?: number
  } | null
  technicians: {
    name: string
    expertise: string
    contact: string
  } | null
}

export interface LaporanFilters {
  search?: string
  severity?: string
  status?: string
  dateFrom?: string
  dateTo?: string
}

export async function getAllLaporan(filters?: LaporanFilters) {
  try {
    let query = supabase
      .from('crash_report')
      .select(`
        *,
        trains (
          train_code,
          name,
          type
        ),
        technicians (
          name,
          expertise,
          contact
        )
      `)
      .order('reported_date', { ascending: false })

    if (filters?.severity) {
      query = query.eq('severity', filters.severity)
    }

    if (filters?.status) {
      query = query.eq('status', filters.status)
    }

    if (filters?.dateFrom) {
      query = query.gte('reported_date', filters.dateFrom)
    }

    if (filters?.dateTo) {
      query = query.lte('reported_date', filters.dateTo)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching laporan - Full error:', JSON.stringify(error))
      throw error
    }

    let result = (data as LaporanWithDetails[]) || []
    
    if (filters?.search) {
      const searchLower = filters.search.toLowerCase()
      result = result.filter(item => 
        item.trains?.train_code?.toLowerCase().includes(searchLower) ||
        item.trains?.name?.toLowerCase().includes(searchLower) ||
        item.description?.toLowerCase().includes(searchLower)
      )
    }

    return result
  } catch (error) {
    console.error('Error fetching laporan:', error)
    return []
  }
}

export async function getLaporanById(id: string) {
  try {
    console.log('Fetching laporan with ID:', id)
    
    const { data, error } = await supabase
      .from('crash_report')
      .select(`
        *,
        trains (
          id,
          train_code,
          name,
          type,
          year
        ),
        technicians (
          id,
          name,
          expertise,
          contact
        )
      `)
      .eq('id', id)
      .single()

    if (error) {
      console.error('Supabase error:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      })
      throw error
    }

    if (!data) {
      console.error('No data returned for ID:', id)
      return null
    }

    console.log('Successfully fetched laporan')
    return data as LaporanWithDetails
  } catch (error: any) {
    console.error('Error in getLaporanById:', {
      message: error?.message,
      details: error?.details,
      code: error?.code
    })
    return null
  }
}

export async function createLaporan(laporan: LaporanInsert) {
  try {
    const { data, error } = await supabase
      .from('crash_report')
      .insert(laporan as any)
      .select()
      .single()

    if (error) throw error

    return { success: true, data }
  } catch (error: any) {
    console.error('Error creating laporan:', error)
    return { success: false, error: error.message }
  }
}

export async function updateLaporan(id: string, updates: LaporanUpdate) {
  try {
    const { data, error } = await supabase
      .from('crash_report')
      .update(updates as any)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return { success: true, data }
  } catch (error: any) {
    console.error('Error updating laporan:', error)
    return { success: false, error: error.message }
  }
}

export async function deleteLaporan(id: string) {
  try {
    const { error } = await supabase
      .from('crash_report')
      .delete()
      .eq('id', id)

    if (error) throw error

    return { success: true }
  } catch (error: any) {
    console.error('Error deleting laporan:', error)
    return { success: false, error: error.message }
  }
}

export async function getAllTrains() {
  try {
    const { data, error } = await supabase
      .from('trains')
      .select('id, train_code, name, type')
      .order('train_code', { ascending: true })

    if (error) throw error

    return data || []
  } catch (error) {
    console.error('Error fetching trains:', error)
    return []
  }
}

export async function getAllTechnicians() {
  try {
    const { data, error } = await supabase
      .from('technicians')
      .select('id, name, expertise, contact')
      .order('name', { ascending: true })

    if (error) throw error

    return data || []
  } catch (error) {
    console.error('Error fetching technicians:', error)
    return []
  }
}