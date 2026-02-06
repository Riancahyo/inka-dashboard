import { Suspense } from 'react'
import Link from 'next/link'
import { Plus, Calendar, CheckCircle, AlertCircle, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { PageContainer } from '@/components/layout/PageContainer'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { StatsCard } from '@/components/dashboard/StatsCard'
import { MaintenanceTable } from '@/components/tables/MaintenanceTable'
import { MaintenanceFilters } from '@/components/filters/MaintenanceFilters'
import { getAllMaintenance, getMaintenanceStats } from '@/services/maintenance.service'

interface PageProps {
  searchParams: Promise<{
    search?: string
    urgency?: string
    status?: string
    dateFrom?: string
    dateTo?: string
  }>
}

async function MaintenanceContent({ searchParams }: PageProps) {
  const params = await searchParams
  
  const [maintenanceList, stats] = await Promise.all([
    getAllMaintenance({
      search: params.search,
      urgency: params.urgency,
      status: params.status,
      dateFrom: params.dateFrom,
      dateTo: params.dateTo,
    }),
    getMaintenanceStats(),
  ])

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Bulan Ini"
          value={stats.totalThisMonth}
          icon={Calendar}
          iconColor="text-blue-600"
          iconBgColor="bg-blue-100"
        />
        <StatsCard
          title="Pending"
          value={stats.pending}
          icon={Clock}
          iconColor="text-yellow-600"
          iconBgColor="bg-yellow-100"
        />
        <StatsCard
          title="Completed"
          value={stats.completed}
          icon={CheckCircle}
          iconColor="text-green-600"
          iconBgColor="bg-green-100"
        />
        <StatsCard
          title="Urgent"
          value={stats.urgent}
          description="High & Urgent"
          icon={AlertCircle}
          iconColor="text-red-600"
          iconBgColor="bg-red-100"
        />
      </div>

      <MaintenanceFilters />
      <Card>
        <CardContent className="p-6">
          <MaintenanceTable data={maintenanceList} />
        </CardContent>
      </Card>
    </>
  )
}

export default function MaintenancePage({ searchParams }: PageProps) {
  return (
    <PageContainer
      title="Jadwal Maintenance"
      description="Kelola jadwal maintenance kereta"
      action={
        <Button asChild className="w-10 p-0 sm:w-auto sm:px-4">
          <Link href="/dashboard/maintenance/new">
            <Plus className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Schedule Maintenance</span>
          </Link>
        </Button>
      }
    >
      <Suspense
        fallback={
          <div className="flex h-96 items-center justify-center">
            <LoadingSpinner size="lg" />
          </div>
        }
      >
        <MaintenanceContent searchParams={searchParams} />
      </Suspense>
    </PageContainer>
  )
}