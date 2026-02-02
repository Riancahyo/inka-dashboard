'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { MENU_ITEMS } from '@/constants/menu'
import { Train } from 'lucide-react'

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-gray-200 bg-white">
      <div className="flex h-16 items-center gap-2 border-b border-gray-200 px-6">
        <Train className="h-8 w-8 text-blue-600" />
        <div>
          <h1 className="text-xl font-bold text-gray-900">INKA</h1>
          <p className="text-xs text-gray-500">Dashboard</p>
        </div>
      </div>

      <nav className="space-y-1 p-4">
        {MENU_ITEMS.map((item) => {
          const isActive = 
            pathname === item.href || 
            (item.href !== '/dashboard' && pathname.startsWith(item.href))
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="absolute bottom-0 left-0 right-0 border-t border-gray-200 p-4">
        <p className="text-xs text-gray-500 text-center">
          © 2024 PT INKA Dashboard
        </p>
      </div>
    </aside>
  )
}