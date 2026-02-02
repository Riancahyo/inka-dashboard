import { PageContainer } from '@/components/layout/PageContainer'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ProfileSettings } from '@/components/settings/ProfileSettings'
import { PreferencesSettings } from '@/components/settings/PreferencesSettings'
import { SystemInfo } from '@/components/settings/SystemInfo'
import { DataManagement } from '@/components/settings/DataManagement'

export default function SettingsPage() {
  return (
    <PageContainer
      title="Settings"
      description="Kelola pengaturan aplikasi dan profil Anda"
    >
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="data">Data Management</TabsTrigger>
          <TabsTrigger value="system">System Info</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6">
          <ProfileSettings />
        </TabsContent>

        <TabsContent value="preferences" className="mt-6">
          <PreferencesSettings />
        </TabsContent>

        <TabsContent value="data" className="mt-6">
          <DataManagement />
        </TabsContent>

        <TabsContent value="system" className="mt-6">
          <SystemInfo />
        </TabsContent>
      </Tabs>
    </PageContainer>
  )
}