'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { SEVERITY_LEVELS, STATUS_OPTIONS } from '@/constants/severity'

export function LaporanFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (value && value !== 'all') {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    
    router.push(`/dashboard/laporan?${params.toString()}`)
  }

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const search = formData.get('search') as string
    handleFilter('search', search)
  }

  const handleReset = () => {
    router.push('/dashboard/laporan')
  }

  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="grid gap-4 md:grid-cols-4">
          <form onSubmit={handleSearch} className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                name="search"
                placeholder="Cari kode kereta, nama, atau deskripsi..."
                className="pl-10"
                defaultValue={searchParams.get('search') || ''}
              />
            </div>
          </form>

          <Select
            defaultValue={searchParams.get('severity') || 'all'}
            onValueChange={(value) => handleFilter('severity', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Semua Severity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Severity</SelectItem>
              {Object.values(SEVERITY_LEVELS).map((level) => (
                <SelectItem key={level} value={level}>
                  {level}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            defaultValue={searchParams.get('status') || 'all'}
            onValueChange={(value) => handleFilter('status', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Semua Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              {Object.values(STATUS_OPTIONS).map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {searchParams.toString() && (
          <div className="mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
            >
              Reset Filter
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}