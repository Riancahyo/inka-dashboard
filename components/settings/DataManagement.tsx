'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download, Upload, Trash2, AlertTriangle } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

export function DataManagement() {
  const handleExportData = (type: string) => {
    alert(`Exporting ${type} data...`)
  }

  const handleImportData = () => {
    alert('Import data functionality')
  }

  const handleClearCache = () => {
    localStorage.clear()
    alert('Cache cleared successfully!')
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Export Data</CardTitle>
          <CardDescription>Download your data in various formats</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Button
              variant="outline"
              className="justify-start"
              onClick={() => handleExportData('trains')}
            >
              <Download className="mr-2 h-4 w-4" />
              Export Trains Data (CSV)
            </Button>
            <Button
              variant="outline"
              className="justify-start"
              onClick={() => handleExportData('reports')}
            >
              <Download className="mr-2 h-4 w-4" />
              Export Reports Data (CSV)
            </Button>
            <Button
              variant="outline"
              className="justify-start"
              onClick={() => handleExportData('maintenance')}
            >
              <Download className="mr-2 h-4 w-4" />
              Export Maintenance (CSV)
            </Button>
            <Button
              variant="outline"
              className="justify-start"
              onClick={() => handleExportData('technicians')}
            >
              <Download className="mr-2 h-4 w-4" />
              Export Technicians (CSV)
            </Button>
          </div>
          <Button variant="default" onClick={() => handleExportData('all')}>
            <Download className="mr-2 h-4 w-4" />
            Export All Data (ZIP)
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Import Data</CardTitle>
          <CardDescription>Upload data from CSV files</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" onClick={handleImportData}>
            <Upload className="mr-2 h-4 w-4" />
            Import Data (CSV)
          </Button>
          <p className="mt-2 text-sm text-gray-500">
            Upload CSV files to import trains, reports, or maintenance data
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cache Management</CardTitle>
          <CardDescription>Manage application cache</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" onClick={handleClearCache}>
            <Trash2 className="mr-2 h-4 w-4" />
            Clear Cache
          </Button>
          <p className="mt-2 text-sm text-gray-500">
            Clear cached data to free up space and refresh the application
          </p>
        </CardContent>
      </Card>

      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-600">Danger Zone</CardTitle>
          <CardDescription>Irreversible actions - proceed with caution</CardDescription>
        </CardHeader>
        <CardContent>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <AlertTriangle className="mr-2 h-4 w-4" />
                Reset All Data
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete all data from the
                  database including trains, reports, maintenance, and technicians.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction className="bg-red-600 hover:bg-red-700">
                  Yes, reset all data
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <p className="mt-2 text-sm text-red-600">
            ⚠️ This will delete all data permanently. Make sure you have a backup!
          </p>
        </CardContent>
      </Card>
    </div>
  )
}