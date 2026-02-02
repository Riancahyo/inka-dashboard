import { PageContainer } from '@/components/layout/PageContainer'
import { TeknisiForm } from '@/components/forms/TeknisiForm'

export default function NewTeknisiPage() {
  return (
    <PageContainer title="Tambah Teknisi" description="Tambahkan teknisi baru ke sistem">
      <TeknisiForm />
    </PageContainer>
  )
}