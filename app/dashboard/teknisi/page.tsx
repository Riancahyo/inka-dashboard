import { Suspense } from 'react'
import Link from 'next/link'
import { Plus, Users, UserCheck, ClipboardList, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { PageContainer } from '@/components/layout/PageContainer'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { StatsCard } from '@/components/dashboard/StatsCard'
import { TeknisiTable } from '@/components/tables/TeknisiTable'
import { TeknisiFilters } from '@/components/filters/TeknisiFilters'
import { getAllTechnicians, getTechnicianStats } from '@/services/teknisi.service'

interface PageProps {
  searchParams: Promise<{
    search?: string
    expertise?: string
  }>
}

async function TeknisiContent({ searchParams }: PageProps) {
  const params = await searchParams
  
  const [technicians, stats] = await Promise.all([
    getAllTechnicians({
      search: params.search,
      expertise: params.expertise,
    }),
    getTechnicianStats(),
  ])

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Teknisi"
          value={stats.totalTechnicians}
          icon={Users}
          iconColor="text-blue-600"
          iconBgColor="bg-blue-100"
        />
        <StatsCard
          title="Teknisi Aktif"
          value={stats.activeTechnicians}
          description="Sedang menangani"
          icon={UserCheck}
          iconColor="text-green-600"
          iconBgColor="bg-green-100"
        />
        <StatsCard
          title="Total Ditugaskan"
          value={stats.totalAssigned}
          icon={ClipboardList}
          iconColor="text-orange-600"
          iconBgColor="bg-orange-100"
        />
        <StatsCard
          title="Total Selesai"
          value={stats.completedReports}
          icon={CheckCircle}
          iconColor="text-purple-600"
          iconBgColor="bg-purple-100"
        />
      </div>

      <TeknisiFilters />
      <Card>
        <CardContent className="p-6">
          <TeknisiTable data={technicians} />
        </CardContent>
      </Card>
    </>
  )
}

export default function TeknisiPage({ searchParams }: PageProps) {
  return (
    <PageContainer
      title="Teknisi"
      description="Daftar teknisi dan performa mereka"
      action={
        <Button asChild className="w-10 p-0 sm:w-auto sm:px-4">
          <Link href="/dashboard/teknisi/new">
            <Plus className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Tambah Teknisi</span>
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
        <TeknisiContent searchParams={searchParams} />
      </Suspense>
    </PageContainer>
  )
}