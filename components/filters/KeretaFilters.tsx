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
import { useEffect, useState } from 'react'
import { getTrainTypes } from '@/services/kereta.service'

export function KeretaFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [trainTypes, setTrainTypes] = useState<string[]>([])

  useEffect(() => {
    async function loadTypes() {
      const types = await getTrainTypes()
      setTrainTypes(types)
    }
    loadTypes()
  }, [])

  const handleFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())

    if (value && value !== 'all') {
      params.set(key, value)
    } else {
      params.delete(key)
    }

    router.push(`/dashboard/kereta?${params.toString()}`)
  }

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const search = formData.get('search') as string
    handleFilter('search', search)
  }

  const handleReset = () => {
    router.push('/dashboard/kereta')
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
                placeholder="Cari kode atau nama kereta..."
                className="pl-10"
                defaultValue={searchParams.get('search') || ''}
              />
            </div>
          </form>

          <Select
            defaultValue={searchParams.get('type') || 'all'}
            onValueChange={(value) => handleFilter('type', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Semua Tipe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Tipe</SelectItem>
              {trainTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            defaultValue={searchParams.get('kondisi') || 'all'}
            onValueChange={(value) => handleFilter('kondisi', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Semua Kondisi" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Kondisi</SelectItem>
              <SelectItem value="Layak">Layak</SelectItem>
              <SelectItem value="Perbaikan">Perbaikan</SelectItem>
              <SelectItem value="Maintenance">Maintenance</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {searchParams.toString() && (
          <div className="mt-4">
            <Button variant="outline" size="sm" onClick={handleReset}>
              Reset Filter
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}