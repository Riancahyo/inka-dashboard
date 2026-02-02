import { notFound } from 'next/navigation'
import { PageContainer } from '@/components/layout/PageContainer'
import { KeretaForm } from '@/components/forms/KeretaForm'
import { getTrainById } from '@/services/kereta.service'

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditKeretaPage({ params }: PageProps) {
  const { id } = await params
  const train = await getTrainById(id)

  if (!train) {
    notFound()
  }

  return (
    <PageContainer
      title="Edit Kereta"
      description={`Edit data kereta ${train.train_code}`}
    >
      <KeretaForm initialData={train} isEdit={true} />
    </PageContainer>
  )
}