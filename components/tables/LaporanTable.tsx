'use client'

import Link from 'next/link'
import { Eye, Pencil, Trash2 } from 'lucide-react'
import { formatDateTime } from '@/lib/utils'
import { SEVERITY_COLORS, STATUS_COLORS } from '@/constants/severity'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { LaporanWithDetails } from '@/services/laporan.service'
import { deleteLaporan } from '@/services/laporan.service'
import { useRouter } from 'next/navigation'
import { EmptyState } from '@/components/shared/EmptyState'
import { AlertCircle } from 'lucide-react'

interface LaporanTableProps {
  data: LaporanWithDetails[]
}

export function LaporanTable({ data }: LaporanTableProps) {
  const router = useRouter()

  const handleDelete = async (id: string) => {
    const result = await deleteLaporan(id)
    if (result.success) {
      router.refresh()
    } else {
      alert(`Error: ${result.error}`)
    }
  }

  if (data.length === 0) {
    return (
      <EmptyState
        icon={AlertCircle}
        title="Tidak ada laporan"
        description="Belum ada laporan kerusakan. Klik tombol di atas untuk menambah laporan baru."
      />
    )
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>No</TableHead>
            <TableHead>Kode Kereta</TableHead>
            <TableHead>Nama Kereta</TableHead>
            <TableHead>Tipe</TableHead>
            <TableHead>Severity</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Teknisi</TableHead>
            <TableHead>Tanggal</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((laporan, index) => (
            <TableRow key={laporan.id}>
              <TableCell className="font-medium">{index + 1}</TableCell>
              <TableCell>{laporan.trains?.train_code || 'N/A'}</TableCell>
              <TableCell>{laporan.trains?.name || 'Unknown'}</TableCell>
              <TableCell>
                <span className="text-sm text-gray-600">
                  {laporan.trains?.type || '-'}
                </span>
              </TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={SEVERITY_COLORS[laporan.severity as keyof typeof SEVERITY_COLORS]}
                >
                  {laporan.severity}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={STATUS_COLORS[laporan.status as keyof typeof STATUS_COLORS]}
                >
                  {laporan.status}
                </Badge>
              </TableCell>
              <TableCell>
                {laporan.technicians ? (
                  <div>
                    <p className="text-sm font-medium">{laporan.technicians.name}</p>
                    <p className="text-xs text-gray-500">{laporan.technicians.expertise}</p>
                  </div>
                ) : (
                  <span className="text-sm text-gray-400">Belum ditugaskan</span>
                )}
              </TableCell>
              <TableCell className="text-sm text-gray-600">
                {formatDateTime(laporan.reported_date)}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/dashboard/laporan/${laporan.id}`}>
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/dashboard/laporan/${laporan.id}/edit`}>
                      <Pencil className="h-4 w-4" />
                    </Link>
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Laporan?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Apakah Anda yakin ingin menghapus laporan ini? Aksi ini tidak dapat dibatalkan.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(laporan.id)}
                          className="bg-red-500 hover:bg-red-600"
                        >
                          Hapus
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}