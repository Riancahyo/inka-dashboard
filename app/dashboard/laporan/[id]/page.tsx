import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Pencil, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PageContainer } from '@/components/layout/PageContainer'
import { formatDateTime } from '@/lib/utils'
import { SEVERITY_COLORS, STATUS_COLORS } from '@/constants/severity'
import { getLaporanById } from '@/services/laporan.service'

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default async function LaporanDetailPage({ params }: PageProps) {
  const { id } = await params
  
  const laporan = await getLaporanById(id)

  if (!laporan) {
    notFound()
  }

  return (
    <PageContainer
      title="Detail Laporan Kerusakan"
      action={
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/dashboard/laporan">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali
            </Link>
          </Button>
          <Button asChild>
            <Link href={`/dashboard/laporan/${id}/edit`}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </Button>
        </div>
      }
    >
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Informasi Laporan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">ID Laporan</label>
              <p className="mt-1 text-sm font-mono">{laporan.id}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Severity</label>
              <div className="mt-1">
                <Badge
                  variant="outline"
                  className={SEVERITY_COLORS[laporan.severity as keyof typeof SEVERITY_COLORS]}
                >
                  {laporan.severity}
                </Badge>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Status</label>
              <div className="mt-1">
                <Badge
                  variant="outline"
                  className={STATUS_COLORS[laporan.status as keyof typeof STATUS_COLORS]}
                >
                  {laporan.status}
                </Badge>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Tanggal Kejadian</label>
              <p className="mt-1">{formatDateTime(laporan.reported_date)}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Dibuat</label>
              <p className="mt-1 text-sm text-gray-600">{formatDateTime(laporan.created_at)}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Kereta & Teknisi</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Kode Kereta</label>
              <p className="mt-1 font-medium">{laporan.trains?.train_code || 'N/A'}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Nama Kereta</label>
              <p className="mt-1">{laporan.trains?.name || 'Unknown'}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Tipe</label>
              <p className="mt-1">{laporan.trains?.type || '-'}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Teknisi</label>
              {laporan.technicians ? (
                <div className="mt-1">
                  <p className="font-medium">{laporan.technicians.name}</p>
                  <p className="text-sm text-gray-600">{laporan.technicians.expertise}</p>
                  <p className="text-sm text-gray-500">{laporan.technicians.contact}</p>
                </div>
              ) : (
                <p className="mt-1 text-sm text-gray-400">Belum ditugaskan</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Deskripsi Kerusakan</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap text-gray-700">{laporan.description}</p>
          </CardContent>
        </Card>

        {laporan.photo_url && (
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Foto</CardTitle>
            </CardHeader>
            <CardContent>
              <img
                src={laporan.photo_url}
                alt="Foto kerusakan"
                className="max-h-96 rounded-lg object-contain"
              />
            </CardContent>
          </Card>
        )}
      </div>
    </PageContainer>
  )
}