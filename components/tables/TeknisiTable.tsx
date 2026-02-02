'use client'

import Link from 'next/link'
import { Eye, Pencil, Trash2, TrendingUp } from 'lucide-react'
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
import { Progress } from '@/components/ui/progress'
import { TechnicianWithStats } from '@/services/teknisi.service'
import { deleteTechnician } from '@/services/teknisi.service'
import { useRouter } from 'next/navigation'
import { EmptyState } from '@/components/shared/EmptyState'
import { Users } from 'lucide-react'

interface TeknisiTableProps {
  data: TechnicianWithStats[]
}

export function TeknisiTable({ data }: TeknisiTableProps) {
  const router = useRouter()

  const handleDelete = async (id: string) => {
    const result = await deleteTechnician(id)
    if (result.success) {
      router.refresh()
    } else {
      alert(`Error: ${result.error}`)
    }
  }

  const getPerformanceColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    if (score >= 40) return 'text-orange-600'
    return 'text-red-600'
  }

  const getPerformanceBadge = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800 border-green-200'
    if (score >= 60) return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    if (score >= 40) return 'bg-orange-100 text-orange-800 border-orange-200'
    return 'bg-red-100 text-red-800 border-red-200'
  }

  if (data.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title="Tidak ada teknisi"
        description="Belum ada teknisi terdaftar. Klik tombol di atas untuk menambah."
      />
    )
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>No</TableHead>
            <TableHead>Nama</TableHead>
            <TableHead>Keahlian</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Laporan Aktif</TableHead>
            <TableHead>Total Ditugaskan</TableHead>
            <TableHead>Selesai</TableHead>
            <TableHead>Performance</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((technician, index) => (
            <TableRow key={technician.id}>
              <TableCell className="font-medium">{index + 1}</TableCell>
              <TableCell>
                <div>
                  <p className="font-medium">{technician.name}</p>
                  {technician.active_reports && technician.active_reports > 0 && (
                    <p className="text-xs text-blue-600">
                      {technician.active_reports} laporan aktif
                    </p>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="secondary">{technician.expertise}</Badge>
              </TableCell>
              <TableCell className="text-sm text-gray-600">{technician.contact}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-blue-600">
                    {technician.active_reports || 0}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <span className="text-lg font-semibold">{technician.total_assigned || 0}</span>
              </TableCell>
              <TableCell>
                <span className="text-lg font-semibold text-green-600">
                  {technician.completed_reports || 0}
                </span>
              </TableCell>
              <TableCell>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Progress
                      value={technician.performance_score || 0}
                      className="h-2 w-24"
                    />
                    <Badge
                      variant="outline"
                      className={getPerformanceBadge(technician.performance_score || 0)}
                    >
                      <TrendingUp className="mr-1 h-3 w-3" />
                      {technician.performance_score || 0}%
                    </Badge>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/dashboard/teknisi/${technician.id}`}>
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/dashboard/teknisi/${technician.id}/edit`}>
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
                        <AlertDialogTitle>Hapus Teknisi?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Apakah Anda yakin ingin menghapus teknisi {technician.name}? Aksi ini
                          tidak dapat dibatalkan.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(technician.id)}
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