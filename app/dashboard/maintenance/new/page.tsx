import { PageContainer } from '@/components/layout/PageContainer'
import { MaintenanceForm } from '@/components/forms/MaintenanceForm'

export default function NewMaintenancePage() {
  return (
    <PageContainer
      title="Schedule Maintenance"
      description="Jadwalkan maintenance untuk kereta"
    >
      <MaintenanceForm />
    </PageContainer>
  )
}