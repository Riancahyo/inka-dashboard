import { 
  LayoutDashboard, 
  AlertCircle, 
  Calendar, 
  Train, 
  Users, 
  Settings,
  type LucideIcon
} from 'lucide-react'

export interface MenuItem {
  label: string
  href: string
  icon: LucideIcon
}

export const MENU_ITEMS: MenuItem[] = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Laporan Kerusakan',
    href: '/dashboard/laporan',
    icon: AlertCircle,
  },
  {
    label: 'Jadwal Maintenance',
    href: '/dashboard/maintenance',
    icon: Calendar,
  },
  {
    label: 'Inventaris Kereta',
    href: '/dashboard/kereta',
    icon: Train,
  },
  {
    label: 'Teknisi',
    href: '/dashboard/teknisi',
    icon: Users,
  },
  {
    label: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
  },
]