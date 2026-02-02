import { LucideIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

interface StatsCardProps {
  title: string
  value: string | number
  description?: string
  icon: LucideIcon
  trend?: {
    value: number
    isPositive: boolean
  }
  iconColor?: string
  iconBgColor?: string
}

export function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  iconColor = 'text-blue-600',
  iconBgColor = 'bg-blue-100',
}: StatsCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <h3 className="mt-2 text-3xl font-bold text-gray-900">{value}</h3>
            {description && (
              <p className="mt-1 text-sm text-gray-500">{description}</p>
            )}
            {trend && (
              <div className="mt-2 flex items-center gap-1">
                <span
                  className={`text-sm font-medium ${
                    trend.isPositive ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
                </span>
                <span className="text-xs text-gray-500">vs last month</span>
              </div>
            )}
          </div>
          <div className={`rounded-lg p-3 ${iconBgColor}`}>
            <Icon className={`h-6 w-6 ${iconColor}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}