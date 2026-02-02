'use client'

import Link from 'next/link'
import { formatDateTime } from '@/lib/utils'
import { SEVERITY_COLORS, STATUS_COLORS } from '@/constants/severity'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Eye } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface RecentIssue {
  id: string
  train_code: string
  train_name: string
  location?: string
  severity: string
  status: string
  reported_date: string
}

interface RecentIssuesTableProps {
  issues: RecentIssue[]
}

export function RecentIssuesTable({ issues }: RecentIssuesTableProps) {
  if (issues.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center text-gray-500">
        No recent issues found
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>No</TableHead>
          <TableHead>Kode Kereta</TableHead>
          <TableHead>Nama Kereta</TableHead>
          <TableHead>Severity</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Waktu</TableHead>
          <TableHead className="text-right">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {issues.map((issue, index) => (
          <TableRow key={issue.id}>
            <TableCell className="font-medium">{index + 1}</TableCell>
            <TableCell>{issue.train_code}</TableCell>
            <TableCell>{issue.train_name}</TableCell>
            <TableCell>
              <Badge
                variant="outline"
                className={SEVERITY_COLORS[issue.severity as keyof typeof SEVERITY_COLORS]}
              >
                {issue.severity}
              </Badge>
            </TableCell>
            <TableCell>
              <Badge
                variant="outline"
                className={STATUS_COLORS[issue.status as keyof typeof STATUS_COLORS]}
              >
                {issue.status}
              </Badge>
            </TableCell>
            <TableCell className="text-sm text-gray-600">
              {formatDateTime(issue.reported_date)}
            </TableCell>
            <TableCell className="text-right">
              <Button variant="ghost" size="sm" asChild>
                <Link href={`/laporan/${issue.id}`}>
                  <Eye className="h-4 w-4" />
                </Link>
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}