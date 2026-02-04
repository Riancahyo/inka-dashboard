export type UserRole = 'admin' | 'teknisi' | 'viewer'

export interface UserProfile {
  id: string
  email: string
  name: string | null
  role: UserRole
  created_at: string
  updated_at: string
}

export interface Permission {
  module: string
  actions: {
    view: boolean
    create: boolean
    edit: boolean
    delete: boolean
  }
}

export const ROLE_PERMISSIONS: Record<UserRole, Record<string, Permission['actions']>> = {
  admin: {
    dashboard: { view: true, create: true, edit: true, delete: true },
    laporan: { view: true, create: true, edit: true, delete: true },
    kereta: { view: true, create: true, edit: true, delete: true },
    maintenance: { view: true, create: true, edit: true, delete: true },
    teknisi: { view: true, create: true, edit: true, delete: true },
    settings: { view: true, create: true, edit: true, delete: true },
  },
  teknisi: {
    dashboard: { view: true, create: false, edit: false, delete: false },
    laporan: { view: true, create: true, edit: true, delete: false },
    kereta: { view: true, create: false, edit: false, delete: false },
    maintenance: { view: true, create: false, edit: true, delete: false },
    teknisi: { view: true, create: false, edit: false, delete: false },
    settings: { view: true, create: false, edit: true, delete: false },
  },
  viewer: {
    dashboard: { view: true, create: false, edit: false, delete: false },
    laporan: { view: true, create: false, edit: false, delete: false },
    kereta: { view: true, create: false, edit: false, delete: false },
    maintenance: { view: true, create: false, edit: false, delete: false },
    teknisi: { view: true, create: false, edit: false, delete: false },
    settings: { view: true, create: false, edit: false, delete: false },
  },
}

export function canView(role: UserRole, module: string): boolean {
  return ROLE_PERMISSIONS[role]?.[module]?.view ?? false
}

export function canCreate(role: UserRole, module: string): boolean {
  return ROLE_PERMISSIONS[role]?.[module]?.create ?? false
}

export function canEdit(role: UserRole, module: string): boolean {
  return ROLE_PERMISSIONS[role]?.[module]?.edit ?? false
}

export function canDelete(role: UserRole, module: string): boolean {
  return ROLE_PERMISSIONS[role]?.[module]?.delete ?? false
}

export function getRoleLabel(role: UserRole): string {
  const labels: Record<UserRole, string> = {
    admin: 'Administrator',
    teknisi: 'Teknisi',
    viewer: 'Viewer',
  }
  return labels[role]
}

export function getRoleBadgeColor(role: UserRole): string {
  const colors: Record<UserRole, string> = {
    admin: 'bg-purple-100 text-purple-800 border-purple-200',
    teknisi: 'bg-blue-100 text-blue-800 border-blue-200',
    viewer: 'bg-gray-100 text-gray-800 border-gray-200',
  }
  return colors[role]
}