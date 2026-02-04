import { Suspense } from 'react'
import { PageContainer } from '@/components/layout/PageContainer'
import { Card, CardContent } from '@/components/ui/card'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { UsersTable } from '@/components/tables/UsersTable'
import { getAllUsers } from '@/lib/auth'
import { PermissionGate } from '@/components/auth/PermissionGate'
import { AlertCircle } from 'lucide-react'

async function UsersContent() {
  const users = await getAllUsers()

  return (
    <Card>
      <CardContent className="p-6">
        <UsersTable data={users} />
      </CardContent>
    </Card>
  )
}

export default function UsersPage() {
  return (
    <PermissionGate
      module="teknisi"
      action="delete"
      fallback={
        <PageContainer title="Access Denied">
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-12">
              <AlertCircle className="mb-4 h-12 w-12 text-red-500" />
              <h3 className="text-lg font-semibold">Access Denied</h3>
              <p className="text-sm text-gray-600">
                You dont have permission to manage users.
              </p>
            </CardContent>
          </Card>
        </PageContainer>
      }
    >
      <PageContainer
        title="User Management"
        description="Manage users and their roles"
      >
        <Suspense
          fallback={
            <div className="flex h-96 items-center justify-center">
              <LoadingSpinner size="lg" />
            </div>
          }
        >
          <UsersContent />
        </Suspense>
      </PageContainer>
    </PermissionGate>
  )
}