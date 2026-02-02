import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Pencil, ArrowLeft, AlertCircle, Calendar, ClipboardCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PageContainer } from '@/components/layout/PageContainer'
import { formatDateTime, formatDate } from '@/lib/utils'
import { SEVERITY_COLORS, STATUS_COLORS, URGENCY_COLORS, RISK_COLORS } from '@/constants/severity'
import { getTrainById } from '@/services/kereta.service'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default async function KeretaDetailPage({ params }: PageProps) {
  const { id } = await params
  const train = await getTrainById(id)

  if (!train) {
    notFound()
  }

  return (
    <PageContainer
      title="Detail Kereta"
      action={
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/dashboard/kereta">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali
            </Link>
          </Button>
          <Button asChild>
            <Link href={`/dashboard/kereta/${id}/edit`}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Informasi Kereta</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Kode Kereta</label>
                <p className="mt-1 font-mono text-lg font-semibold text-blue-600">
                  {train.train_code}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Nama Kereta</label>
                <p className="mt-1 font-medium">{train.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Tipe</label>
                <div className="mt-1">
                  <Badge variant="secondary">{train.type}</Badge>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Tahun Produksi</label>
                <p className="mt-1">{train.year}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-orange-100 p-3">
                  <AlertCircle className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Laporan</p>
                  <h3 className="text-2xl font-bold">{train.crash_reports?.length || 0}</h3>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-blue-100 p-3">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Maintenance</p>
                  <h3 className="text-2xl font-bold">{train.maintenance?.length || 0}</h3>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-purple-100 p-3">
                  <ClipboardCheck className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Inspeksi</p>
                  <h3 className="text-2xl font-bold">{train.inspections?.length || 0}</h3>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="crash_reports" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="crash_reports">Riwayat Kerusakan</TabsTrigger>
            <TabsTrigger value="maintenance">Riwayat Maintenance</TabsTrigger>
            <TabsTrigger value="inspections">Riwayat Inspeksi</TabsTrigger>
          </TabsList>

          <TabsContent value="crash_reports">
            <Card>
              <CardHeader>
                <CardTitle>Riwayat Kerusakan</CardTitle>
              </CardHeader>
              <CardContent>
                {train.crash_reports && train.crash_reports.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tanggal</TableHead>
                        <TableHead>Severity</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Teknisi</TableHead>
                        <TableHead>Deskripsi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {train.crash_reports.map((report: any) => (
                        <TableRow key={report.id}>
                          <TableCell className="text-sm">
                            {formatDate(report.reported_date)}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={SEVERITY_COLORS[report.severity as keyof typeof SEVERITY_COLORS]}
                            >
                              {report.severity}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={STATUS_COLORS[report.status as keyof typeof STATUS_COLORS]}
                            >
                              {report.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {report.technicians ? (
                              <div className="text-sm">
                                <p className="font-medium">{report.technicians.name}</p>
                                <p className="text-gray-500">{report.technicians.expertise}</p>
                              </div>
                            ) : (
                              <span className="text-sm text-gray-400">-</span>
                            )}
                          </TableCell>
                          <TableCell className="max-w-xs truncate text-sm">
                            {report.description}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="py-8 text-center text-gray-500">
                    Belum ada riwayat kerusakan
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="maintenance">
            <Card>
              <CardHeader>
                <CardTitle>Riwayat Maintenance</CardTitle>
              </CardHeader>
              <CardContent>
                {train.maintenance && train.maintenance.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tanggal</TableHead>
                        <TableHead>Tipe Maintenance</TableHead>
                        <TableHead>Urgency</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {train.maintenance.map((maintenance: any) => (
                        <TableRow key={maintenance.id}>
                          <TableCell className="text-sm">
                            {formatDate(maintenance.schedule_date)}
                          </TableCell>
                          <TableCell className="font-medium">
                            {maintenance.maintenance_type}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={URGENCY_COLORS[maintenance.urgency as keyof typeof URGENCY_COLORS]}
                            >
                              {maintenance.urgency}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{maintenance.status}</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="py-8 text-center text-gray-500">
                    Belum ada riwayat maintenance
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="inspections">
            <Card>
              <CardHeader>
                <CardTitle>Riwayat Inspeksi</CardTitle>
              </CardHeader>
              <CardContent>
                {train.inspections && train.inspections.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tanggal</TableHead>
                        <TableHead>Risk Level</TableHead>
                        <TableHead>Inspector</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {train.inspections.map((inspection: any) => (
                        <TableRow key={inspection.id}>
                          <TableCell className="text-sm">
                            {formatDate(inspection.date)}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={RISK_COLORS[inspection.risk_level as keyof typeof RISK_COLORS]}
                            >
                              {inspection.risk_level}
                            </Badge>
                          </TableCell>
                          <TableCell>{inspection.inspector}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="py-8 text-center text-gray-500">
                    Belum ada riwayat inspeksi
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  )
}