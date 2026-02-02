import { notFound } from 'next/navigation'
import { PageContainer } from '@/components/layout/PageContainer'
import { LaporanForm } from '@/components/forms/LaporanForm'
import { getLaporanById } from '@/services/laporan.service'

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditLaporanPage({ params }: PageProps) {
  const { id } = await params
  
  const laporan = await getLaporanById(id)

  if (!laporan) {
    notFound()
  }

  return (
    <PageContainer
      title="Edit Laporan Kerusakan"
      description={`Edit laporan ${laporan.trains?.train_code || 'N/A'}`}
    >
      <LaporanForm initialData={laporan} isEdit={true} />
    </PageContainer>
  )
}