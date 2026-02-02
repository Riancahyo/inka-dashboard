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
import { getTechnicianExpertise } from '@/services/teknisi.service'

export function TeknisiFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [expertiseList, setExpertiseList] = useState<string[]>([])

  useEffect(() => {
    async function loadExpertise() {
      const expertise = await getTechnicianExpertise()
      setExpertiseList(expertise)
    }
    loadExpertise()
  }, [])

  const handleFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())

    if (value && value !== 'all') {
      params.set(key, value)
    } else {
      params.delete(key)
    }

    router.push(`/dashboard/teknisi?${params.toString()}`)
  }

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const search = formData.get('search') as string
    handleFilter('search', search)
  }

  const handleReset = () => {
    router.push('/dashboard/teknisi')
  }

  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="grid gap-4 md:grid-cols-3">
          <form onSubmit={handleSearch} className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                name="search"
                placeholder="Cari nama, keahlian, atau contact..."
                className="pl-10"
                defaultValue={searchParams.get('search') || ''}
              />
            </div>
          </form>

          <Select
            defaultValue={searchParams.get('expertise') || 'all'}
            onValueChange={(value) => handleFilter('expertise', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Semua Keahlian" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Keahlian</SelectItem>
              {expertiseList.map((expertise) => (
                <SelectItem key={expertise} value={expertise}>
                  {expertise}
                </SelectItem>
              ))}
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