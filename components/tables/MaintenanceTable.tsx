'use client'

import Link from 'next/link'
import { Eye, Pencil, Trash2, CheckCircle } from 'lucide-react'
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MaintenanceWithDetails } from '@/services/maintenance.service'
import { deleteMaintenance, updateMaintenanceStatus } from '@/services/maintenance.service'
import { useRouter } from 'next/navigation'
import { EmptyState } from '@/components/shared/EmptyState'
import { Calendar } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { URGENCY_COLORS } from '@/constants/severity'

interface MaintenanceTableProps {
  data: MaintenanceWithDetails[]
}

const STATUS_COLORS: Record<string, string> = {
  Pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'In Progress': 'bg-blue-100 text-blue-800 border-blue-200',
  Completed: 'bg-green-100 text-green-800 border-green-200',
  Cancelled: 'bg-gray-100 text-gray-800 border-gray-200',
}

export function MaintenanceTable({ data }: MaintenanceTableProps) {
  const router = useRouter()

  const handleDelete = async (id: string) => {
    const result = await deleteMaintenance(id)
    if (result.success) {
      router.refresh()
    } else {
      alert(`Error: ${result.error}`)
    }
  }

  const handleStatusChange = async (id: string, status: string) => {
    const result = await updateMaintenanceStatus(id, status)
    if (result.success) {
      router.refresh()
    } else {
      alert(`Error: ${result.error}`)
    }
  }

  if (data.length === 0) {
    return (
      <EmptyState
        icon={Calendar}
        title="Tidak ada maintenance"
        description="Belum ada jadwal maintenance terdaftar. Klik tombol di atas untuk menambah."
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
            <TableHead>Tipe Maintenance</TableHead>
            <TableHead>Urgency</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Jadwal</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((maintenance, index) => (
            <TableRow key={maintenance.id}>
              <TableCell className="font-medium">{index + 1}</TableCell>
              <TableCell>
                <span className="font-mono font-semibold text-blue-600">
                  {maintenance.trains?.train_code || 'N/A'}
                </span>
              </TableCell>
              <TableCell>{maintenance.trains?.name || 'Unknown'}</TableCell>
              <TableCell>
                <p className="font-medium">{maintenance.maintenance_type}</p>
                <p className="text-xs text-gray-500">{maintenance.trains?.type}</p>
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
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Badge
                        variant="outline"
                        className={STATUS_COLORS[maintenance.status] || 'bg-gray-100'}
                      >
                        {maintenance.status}
                      </Badge>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => handleStatusChange(maintenance.id, 'Pending')}>
                      Pending
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusChange(maintenance.id, 'In Progress')}>
                      In Progress
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusChange(maintenance.id, 'Completed')}>
                      Completed
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusChange(maintenance.id, 'Cancelled')}>
                      Cancelled
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  <p className="font-medium">{formatDate(maintenance.schedule_date)}</p>
                  {new Date(maintenance.schedule_date) < new Date() &&
                    maintenance.status === 'Pending' && (
                      <p className="text-xs text-red-600">Overdue</p>
                    )}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/dashboard/maintenance/${maintenance.id}`}>
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/dashboard/maintenance/${maintenance.id}/edit`}>
                      <Pencil className="h-4 w-4" />
                    </Link>
                  </Button>
                  {maintenance.status === 'Pending' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleStatusChange(maintenance.id, 'Completed')}
                      title="Mark as Completed"
                    >
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </Button>
                  )}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Maintenance?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Apakah Anda yakin ingin menghapus jadwal maintenance ini? Aksi ini tidak
                          dapat dibatalkan.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(maintenance.id)}
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