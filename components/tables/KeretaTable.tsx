'use client'

import Link from 'next/link'
import { Eye, Pencil, Trash2, AlertCircle, CheckCircle, Wrench } from 'lucide-react'
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
import { TrainWithStats } from '@/services/kereta.service'
import { deleteTrain } from '@/services/kereta.service'
import { useRouter } from 'next/navigation'
import { EmptyState } from '@/components/shared/EmptyState'
import { Train } from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface KeretaTableProps {
  data: TrainWithStats[]
}

export function KeretaTable({ data }: KeretaTableProps) {
  const router = useRouter()

  const handleDelete = async (id: string) => {
    const result = await deleteTrain(id)
    if (result.success) {
      router.refresh()
    } else {
      alert(`Error: ${result.error}`)
    }
  }

  const getKondisiBadge = (kondisi: string) => {
    switch (kondisi) {
      case 'Layak':
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="mr-1 h-3 w-3" />
            Layak
          </Badge>
        )
      case 'Perbaikan':
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
            <AlertCircle className="mr-1 h-3 w-3" />
            Perbaikan
          </Badge>
        )
      case 'Maintenance':
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
            <Wrench className="mr-1 h-3 w-3" />
            Maintenance
          </Badge>
        )
      default:
        return <Badge variant="outline">{kondisi}</Badge>
    }
  }

  if (data.length === 0) {
    return (
      <EmptyState
        icon={Train}
        title="Tidak ada kereta"
        description="Belum ada kereta terdaftar. Klik tombol di atas untuk menambah kereta baru."
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
            <TableHead>Tahun</TableHead>
            <TableHead>Kondisi</TableHead>
            <TableHead>Total Laporan</TableHead>
            <TableHead>Maintenance</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((train, index) => (
            <TableRow key={train.id}>
              <TableCell className="font-medium">{index + 1}</TableCell>
              <TableCell>
                <span className="font-mono font-semibold text-blue-600">
                  {train.train_code}
                </span>
              </TableCell>
              <TableCell>
                <div>
                  <p className="font-medium">{train.name}</p>
                  {train.total_laporan_open && train.total_laporan_open > 0 && (
                    <p className="text-xs text-red-600">
                      {train.total_laporan_open} kerusakan aktif
                    </p>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="secondary">{train.type}</Badge>
              </TableCell>
              <TableCell>{train.year}</TableCell>
              <TableCell>{getKondisiBadge(train.kondisi || 'Layak')}</TableCell>
              <TableCell>
                <div className="text-sm">
                  <p className="font-medium">{train.total_laporan || 0}</p>
                  <p className="text-gray-500 text-xs">total laporan</p>
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  <p className="font-medium">{train.total_maintenance || 0}x</p>
                  {train.last_maintenance && (
                    <p className="text-gray-500 text-xs">
                      {formatDate(train.last_maintenance)}
                    </p>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/dashboard/kereta/${train.id}`}>
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/dashboard/kereta/${train.id}/edit`}>
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
                        <AlertDialogTitle>Hapus Kereta?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Apakah Anda yakin ingin menghapus kereta {train.train_code}? 
                          Aksi ini tidak dapat dibatalkan.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(train.id)}
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