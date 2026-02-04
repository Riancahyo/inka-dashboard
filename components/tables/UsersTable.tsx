'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { UserProfile, UserRole, getRoleLabel, getRoleBadgeColor } from '@/types/roles'
import { updateUserRole } from '@/lib/auth'
import { formatDateTime } from '@/lib/utils'
import { EmptyState } from '@/components/shared/EmptyState'
import { Users } from 'lucide-react'

interface UsersTableProps {
  data: UserProfile[]
}

export function UsersTable({ data }: UsersTableProps) {
  const router = useRouter()
  const [updating, setUpdating] = useState<string | null>(null)

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    setUpdating(userId)
    
    const result = await updateUserRole(userId, newRole)
    
    if (result.success) {
      router.refresh()
    } else {
      alert(`Error: ${result.error}`)
    }
    
    setUpdating(null)
  }

  if (data.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title="No users found"
        description="No users registered yet."
      />
    )
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>No</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Current Role</TableHead>
            <TableHead>Change Role</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead>Last Updated</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((user, index) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{index + 1}</TableCell>
              <TableCell>
                <div>
                  <p className="font-medium">{user.name || 'N/A'}</p>
                  <p className="text-xs text-gray-500">{user.id.slice(0, 8)}...</p>
                </div>
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Badge variant="outline" className={getRoleBadgeColor(user.role)}>
                  {getRoleLabel(user.role)}
                </Badge>
              </TableCell>
              <TableCell>
                <Select
                  value={user.role}
                  onValueChange={(value) => handleRoleChange(user.id, value as UserRole)}
                  disabled={updating === user.id}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">
                      <span className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-purple-500" />
                        Administrator
                      </span>
                    </SelectItem>
                    <SelectItem value="teknisi">
                      <span className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-blue-500" />
                        Teknisi
                      </span>
                    </SelectItem>
                    <SelectItem value="viewer">
                      <span className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-gray-500" />
                        Viewer
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell className="text-sm text-gray-600">
                {formatDateTime(user.created_at)}
              </TableCell>
              <TableCell className="text-sm text-gray-600">
                {formatDateTime(user.updated_at)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}