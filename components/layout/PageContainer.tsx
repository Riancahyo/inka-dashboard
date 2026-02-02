import { ReactNode } from 'react'

interface PageContainerProps {
  children: ReactNode
  title?: string
  description?: string
  action?: ReactNode
}

export function PageContainer({
  children,
  title,
  description,
  action,
}: PageContainerProps) {
  return (
    <div className="space-y-6">
      {(title || action) && (
        <div className="flex items-center justify-between">
          <div>
            {title && (
              <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
            )}
            {description && (
              <p className="mt-1 text-sm text-gray-500">{description}</p>
            )}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div>{children}</div>
    </div>
  )
}