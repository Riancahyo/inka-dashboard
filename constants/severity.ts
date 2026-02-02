export const SEVERITY_LEVELS = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
  CRITICAL: 'Critical',
} as const

export type SeverityLevel = typeof SEVERITY_LEVELS[keyof typeof SEVERITY_LEVELS]

export const SEVERITY_COLORS: Record<SeverityLevel, string> = {
  Low: 'bg-blue-100 text-blue-800 border-blue-200',
  Medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  High: 'bg-orange-100 text-orange-800 border-orange-200',
  Critical: 'bg-red-100 text-red-800 border-red-200',
}

export const STATUS_OPTIONS = {
  OPEN: 'Open',
  ON_PROGRESS: 'On Progress',
  FINISHED: 'Finished',
} as const

export type StatusOption = typeof STATUS_OPTIONS[keyof typeof STATUS_OPTIONS]

export const STATUS_COLORS: Record<StatusOption, string> = {
  Open: 'bg-gray-100 text-gray-800 border-gray-200',
  'On Progress': 'bg-blue-100 text-blue-800 border-blue-200',
  Finished: 'bg-green-100 text-green-800 border-green-200',
}

export const URGENCY_LEVELS = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
  URGENT: 'Urgent',
} as const

export type UrgencyLevel = typeof URGENCY_LEVELS[keyof typeof URGENCY_LEVELS]

export const URGENCY_COLORS: Record<UrgencyLevel, string> = {
  Low: 'bg-blue-100 text-blue-800 border-blue-200',
  Medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  High: 'bg-orange-100 text-orange-800 border-orange-200',
  Urgent: 'bg-red-100 text-red-800 border-red-200',
}

export const RISK_LEVELS = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
} as const

export type RiskLevel = typeof RISK_LEVELS[keyof typeof RISK_LEVELS]

export const RISK_COLORS: Record<RiskLevel, string> = {
  Low: 'bg-green-100 text-green-800 border-green-200',
  Medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  High: 'bg-red-100 text-red-800 border-red-200',
}