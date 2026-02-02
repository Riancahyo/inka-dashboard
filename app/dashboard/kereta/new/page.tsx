import { PageContainer } from '@/components/layout/PageContainer'
import { KeretaForm } from '@/components/forms/KeretaForm'

export default function NewKeretaPage() {
  return (
    <PageContainer
      title="Tambah Kereta"
      description="Tambahkan kereta baru ke inventaris"
    >
      <KeretaForm />
    </PageContainer>
  )
}