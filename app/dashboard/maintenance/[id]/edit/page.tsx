import { notFound } from 'next/navigation'
import { PageContainer } from '@/components/layout/PageContainer'
import { MaintenanceForm } from '@/components/forms/MaintenanceForm'
import { getMaintenanceById } from '@/services/maintenance.service'

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditMaintenancePage({ params }: PageProps) {
  const { id } = await params
  const maintenance = await getMaintenanceById(id)

  if (!maintenance) {
    notFound()
  }

  return (
    <PageContainer
      title="Edit Maintenance"
      description={`Edit jadwal maintenance ${maintenance.trains?.train_code || ''}`}
    >
      <MaintenanceForm initialData={maintenance} isEdit={true} />
    </PageContainer>
  )
}