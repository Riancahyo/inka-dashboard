import { Suspense } from 'react'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { PageContainer } from '@/components/layout/PageContainer'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { KeretaTable } from '@/components/tables/KeretaTable'
import { KeretaFilters } from '@/components/filters/KeretaFilters'
import { getAllTrains } from '@/services/kereta.service'

interface PageProps {
  searchParams: Promise<{
    search?: string
    type?: string
    kondisi?: string
  }>
}

async function KeretaList({ searchParams }: PageProps) {
  const params = await searchParams
  
  const trains = await getAllTrains({
    search: params.search,
    type: params.type,
    kondisi: params.kondisi,
  })

  return (
    <>
      <KeretaFilters />
      <Card>
        <CardContent className="p-6">
          <KeretaTable data={trains} />
        </CardContent>
      </Card>
    </>
  )
}

export default function KeretaPage({ searchParams }: PageProps) {
  return (
    <PageContainer
      title="Inventaris Kereta"
      description="Daftar semua kereta dan kondisinya"
      action={
        <Button asChild>
          <Link href="/dashboard/kereta/new">
            <Plus className="mr-2 h-4 w-4" />
            Tambah Kereta
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
        <KeretaList searchParams={searchParams} />
      </Suspense>
    </PageContainer>
  )
}