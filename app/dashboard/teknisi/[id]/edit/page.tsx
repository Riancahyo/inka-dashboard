import { notFound } from 'next/navigation'
import { PageContainer } from '@/components/layout/PageContainer'
import { TeknisiForm } from '@/components/forms/TeknisiForm'
import { getTechnicianById } from '@/services/teknisi.service'

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditTeknisiPage({ params }: PageProps) {
  const { id } = await params
  const technician = await getTechnicianById(id)

  if (!technician) {
    notFound()
  }

  return (
    <PageContainer title="Edit Teknisi" description={`Edit data teknisi ${technician.name}`}>
      <TeknisiForm initialData={technician} isEdit={true} />
    </PageContainer>
  )
}