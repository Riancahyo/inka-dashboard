import { supabase } from '@/lib/supabase'

export interface MaintenanceWithDetails {
  id: string
  train_id: string
  maintenance_type: string
  urgency: string
  status: string
  schedule_date: string
  created_at: string
  trains: {
    train_code: string
    name: string
    type: string
  } | null
}

export interface MaintenanceInsert {
  train_id: string
  maintenance_type: string
  urgency: string
  status: string
  schedule_date: string
}

export interface MaintenanceUpdate {
  train_id?: string
  maintenance_type?: string
  urgency?: string
  status?: string
  schedule_date?: string
}

export interface MaintenanceFilters {
  search?: string
  urgency?: string
  status?: string
  dateFrom?: string
  dateTo?: string
}

export async function getAllMaintenance(filters?: MaintenanceFilters) {
  try {
    let query = supabase
      .from('maintenance')
      .select(`
        *,
        trains (
          train_code,
          name,
          type
        )
      `)
      .order('schedule_date', { ascending: false })

    if (filters?.urgency) {
      query = query.eq('urgency', filters.urgency)
    }

    if (filters?.status) {
      query = query.eq('status', filters.status)
    }

    if (filters?.dateFrom) {
      query = query.gte('schedule_date', filters.dateFrom)
    }

    if (filters?.dateTo) {
      query = query.lte('schedule_date', filters.dateTo)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching maintenance:', error)
      throw error
    }

    let result = (data as MaintenanceWithDetails[]) || []

    if (filters?.search) {
      const searchLower = filters.search.toLowerCase()
      result = result.filter(
        (item) =>
          item.trains?.train_code?.toLowerCase().includes(searchLower) ||
          item.trains?.name?.toLowerCase().includes(searchLower) ||
          item.maintenance_type?.toLowerCase().includes(searchLower)
      )
    }

    return result
  } catch (error) {
    console.error('Error fetching maintenance:', error)
    return []
  }
}

export async function getMaintenanceById(id: string) {
  try {
    console.log('Fetching maintenance with ID:', id)

    const { data, error } = await supabase
      .from('maintenance')
      .select(`
        *,
        trains (
          id,
          train_code,
          name,
          type,
          year
        )
      `)
      .eq('id', id)
      .single()

    if (error) {
      console.error('Supabase error:', error)
      throw error
    }

    if (!data) {
      console.error('No maintenance found for ID:', id)
      return null
    }

    console.log('Successfully fetched maintenance')
    return data as MaintenanceWithDetails
  } catch (error: any) {
    console.error('Error in getMaintenanceById:', error)
    return null
  }
}

export async function createMaintenance(maintenance: MaintenanceInsert) {
  try {
    const { data, error } = await supabase
      .from('maintenance')
      .insert(maintenance as any)
      .select()
      .single()

    if (error) throw error

    return { success: true, data }
  } catch (error: any) {
    console.error('Error creating maintenance:', error)
    return { success: false, error: error.message }
  }
}

export async function updateMaintenance(id: string, updates: MaintenanceUpdate) {
  try {
    const { data, error } = await supabase
      .from('maintenance')
      .update(updates as any)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return { success: true, data }
  } catch (error: any) {
    console.error('Error updating maintenance:', error)
    return { success: false, error: error.message }
  }
}

export async function updateMaintenanceStatus(id: string, status: string) {
  try {
    const { data, error } = await supabase
      .from('maintenance')
      .update({ status })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return { success: true, data }
  } catch (error: any) {
    console.error('Error updating maintenance status:', error)
    return { success: false, error: error.message }
  }
}

export async function deleteMaintenance(id: string) {
  try {
    const { error } = await supabase.from('maintenance').delete().eq('id', id)

    if (error) throw error

    return { success: true }
  } catch (error: any) {
    console.error('Error deleting maintenance:', error)
    return { success: false, error: error.message }
  }
}

export async function getMaintenanceStats() {
  try {
    const now = new Date()
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const firstDayString = firstDayOfMonth.toISOString()

    const { count: totalThisMonth } = await supabase
      .from('maintenance')
      .select('*', { count: 'exact', head: true })
      .gte('schedule_date', firstDayString)

    const { count: pending } = await supabase
      .from('maintenance')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'Pending')

    const { count: completed } = await supabase
      .from('maintenance')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'Completed')

    const { count: urgent } = await supabase
      .from('maintenance')
      .select('*', { count: 'exact', head: true })
      .in('urgency', ['High', 'Urgent'])
      .eq('status', 'Pending')

    return {
      totalThisMonth: totalThisMonth || 0,
      pending: pending || 0,
      completed: completed || 0,
      urgent: urgent || 0,
    }
  } catch (error) {
    console.error('Error fetching maintenance stats:', error)
    return {
      totalThisMonth: 0,
      pending: 0,
      completed: 0,
      urgent: 0,
    }
  }
}

export async function getUpcomingMaintenance() {
  try {
    const now = new Date()
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)

    const { data, error } = await supabase
      .from('maintenance')
      .select(`
        *,
        trains (
          train_code,
          name
        )
      `)
      .gte('schedule_date', now.toISOString())
      .lte('schedule_date', nextWeek.toISOString())
      .eq('status', 'Pending')
      .order('schedule_date', { ascending: true })

    if (error) throw error

    return (data as MaintenanceWithDetails[]) || []
  } catch (error) {
    console.error('Error fetching upcoming maintenance:', error)
    return []
  }
}