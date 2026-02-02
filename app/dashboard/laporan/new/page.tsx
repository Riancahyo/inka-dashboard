import { PageContainer } from '@/components/layout/PageContainer'
import { LaporanForm } from '@/components/forms/LaporanForm'

export default function NewLaporanPage() {
  return (
    <PageContainer
      title="Tambah Laporan Kerusakan"
      description="Buat laporan kerusakan kereta baru"
    >
      <LaporanForm />
    </PageContainer>
  )
}