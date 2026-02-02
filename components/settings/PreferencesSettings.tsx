'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

export function PreferencesSettings() {
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    pushNotifications: false,
    maintenanceAlerts: true,
    reportAlerts: true,
    language: 'id',
    timezone: 'Asia/Jakarta',
    dateFormat: 'DD/MM/YYYY',
    theme: 'light',
  })

  const handleToggle = (key: string) => {
    setPreferences((prev) => ({ ...prev, [key]: !prev[key as keyof typeof prev] }))
  }

  const handleSelect = (key: string, value: string) => {
    setPreferences((prev) => ({ ...prev, [key]: value }))
  }

  const handleSave = () => {
    alert('Preferences saved successfully!')
  }

  return (
    <div className="space-y-6">
      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Manage how you receive notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Email Notifications</Label>
              <p className="text-sm text-gray-500">Receive notifications via email</p>
            </div>
            <Switch
              checked={preferences.emailNotifications}
              onCheckedChange={() => handleToggle('emailNotifications')}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Push Notifications</Label>
              <p className="text-sm text-gray-500">Receive push notifications in browser</p>
            </div>
            <Switch
              checked={preferences.pushNotifications}
              onCheckedChange={() => handleToggle('pushNotifications')}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Maintenance Alerts</Label>
              <p className="text-sm text-gray-500">Get alerts for upcoming maintenance</p>
            </div>
            <Switch
              checked={preferences.maintenanceAlerts}
              onCheckedChange={() => handleToggle('maintenanceAlerts')}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Report Alerts</Label>
              <p className="text-sm text-gray-500">Get alerts for new crash reports</p>
            </div>
            <Switch
              checked={preferences.reportAlerts}
              onCheckedChange={() => handleToggle('reportAlerts')}
            />
          </div>
        </CardContent>
      </Card>

      {/* Localization */}
      <Card>
        <CardHeader>
          <CardTitle>Localization</CardTitle>
          <CardDescription>Customize language and regional settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Language</Label>
            <Select value={preferences.language} onValueChange={(val) => handleSelect('language', val)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="id">Bahasa Indonesia</SelectItem>
                <SelectItem value="en">English</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Timezone</Label>
            <Select value={preferences.timezone} onValueChange={(val) => handleSelect('timezone', val)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Asia/Jakarta">Asia/Jakarta (WIB)</SelectItem>
                <SelectItem value="Asia/Makassar">Asia/Makassar (WITA)</SelectItem>
                <SelectItem value="Asia/Jayapura">Asia/Jayapura (WIT)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Date Format</Label>
            <Select value={preferences.dateFormat} onValueChange={(val) => handleSelect('dateFormat', val)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Appearance */}
      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Customize the look and feel of the dashboard</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Theme</Label>
            <Select value={preferences.theme} onValueChange={(val) => handleSelect('theme', val)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500">Choose your preferred theme</p>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave}>Save Preferences</Button>
      </div>
    </div>
  )
}