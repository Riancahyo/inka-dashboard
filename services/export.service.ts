export interface ExportFilters {
  severity?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  trainId?: string;
}

export interface ExportOptions {
  filters?: ExportFilters;
  format: 'pdf' | 'excel';
}

export async function exportReports(options: ExportOptions): Promise<Blob> {
  const endpoint = options.format === 'pdf' ? '/api/export/pdf' : '/api/export/excel';
  
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ filters: options.filters }),
  });

  if (!response.ok) {
    throw new Error('Export failed');
  }

  return response.blob();
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

export function generateFilename(format: 'pdf' | 'excel'): string {
  const date = new Date().toISOString().split('T')[0]; 
  const extension = format === 'pdf' ? 'pdf' : 'xlsx';
  return `crash-reports-${date}.${extension}`;
}