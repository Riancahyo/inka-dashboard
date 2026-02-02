import { Suspense } from 'react'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { PageContainer } from '@/components/layout/PageContainer'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { LaporanTable } from '@/components/tables/LaporanTable'
import { LaporanFilters } from '@/components/filters/LaporanFilters'
import { getAllLaporan } from '@/services/laporan.service'

interface PageProps {
  searchParams: {
    search?: string
    severity?: string
    status?: string
    dateFrom?: string
    dateTo?: string
  }
}

async function LaporanList({ searchParams }: PageProps) {
    const params = await searchParams;
  const laporan = await getAllLaporan({
    search: params.search,
    severity: params.severity,
    status: params.status,
    dateFrom: params.dateFrom,
    dateTo: params.dateTo,
  })

  return (
    <>
      <LaporanFilters />
      <Card>
        <CardContent className="p-6">
          <LaporanTable data={laporan} />
        </CardContent>
      </Card>
    </>
  )
}

export default function LaporanPage({ searchParams }: PageProps) {
  return (
    <PageContainer
      title="Laporan Kerusakan"
      description="Daftar semua laporan kerusakan kereta"
      action={
        <Button asChild>
          <Link href="/dashboard/laporan/new">
            <Plus className="mr-2 h-4 w-4" />
            Tambah Laporan
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
        <LaporanList searchParams={searchParams} />
      </Suspense>
    </PageContainer>
  )
}