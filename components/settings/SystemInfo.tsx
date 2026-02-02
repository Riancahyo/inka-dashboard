import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Package, Server, Database, Code, Calendar } from 'lucide-react'

export function SystemInfo() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Application Information</CardTitle>
          <CardDescription>System details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center gap-3">
              <Package className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium">Name</p>
                <p className="text-sm text-gray-600">INKA Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Code className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium">Version</p>
                <Badge variant="secondary">1.0.0</Badge>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Database className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium">Database</p>
                <p className="text-sm text-gray-600">Supabase</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Server className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium">Framework</p>
                <p className="text-sm text-gray-600">Next.js 15</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}