'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { Download, FileSpreadsheet, FileText } from 'lucide-react';
import { exportReports, downloadBlob, generateFilename, ExportOptions } from '@/services/export.service';
import { toast } from 'sonner';

interface ExportButtonProps {
  filters?: ExportOptions['filters'];
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export function ExportButton({ filters, variant = 'outline', size = 'default' }: ExportButtonProps) {
  const [exporting, setExporting] = useState(false);

  const handleExport = async (format: 'pdf' | 'excel') => {
    setExporting(true);
    const toastId = toast.loading(`Generating ${format.toUpperCase()}...`);

    try {
      console.log('Sending filters:', filters);
      
      const options: ExportOptions = {
        format,
        filters: filters || {}, 
      };

      const blob = await exportReports(options);
      const filename = generateFilename(format);
      
      downloadBlob(blob, filename);
      
      toast.success(`${format.toUpperCase()} downloaded successfully`, { id: toastId });
    } catch (error) {
      console.error('Export error:', error);
      toast.error(`Failed to generate ${format.toUpperCase()}`, { id: toastId });
    } finally {
      setExporting(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant={variant} 
          size={size} 
          disabled={exporting}
          className="w-10 p-0 sm:w-auto sm:px-4"
        >
          <Download className="h-4 w-4 sm:mr-2" />
          <span className="hidden sm:inline">Export</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Export Format</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleExport('excel')} disabled={exporting}>
          <FileSpreadsheet className="mr-2 h-4 w-4 text-green-600" />
          Export to Excel (.xlsx)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('pdf')} disabled={exporting}>
          <FileText className="mr-2 h-4 w-4 text-red-600" />
          Export to PDF
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}