import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import ExcelJS from 'exceljs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const filters = body.filters || {};

    let query = supabase
      .from('crash_report')
      .select(`
        *,
        trains (
          train_code,
          name,
          type
        ),
        technicians (
          name,
          expertise
        )
      `)
      .order('reported_date', { ascending: false });

    if (filters?.severity) query = query.eq('severity', filters.severity);
    if (filters?.status) query = query.eq('status', filters.status);
    if (filters?.dateFrom) query = query.gte('reported_date', filters.dateFrom);
    if (filters?.dateTo) query = query.lte('reported_date', filters.dateTo);
    if (filters?.trainId) query = query.eq('train_id', filters.trainId);

    const { data: reports, error } = await query;

    if (error) throw error;

    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'PT INKA';
    workbook.created = new Date();

    const dataSheet = workbook.addWorksheet('Crash Reports');

    const headerRow = dataSheet.addRow([
      'ID',
      'Train Code',
      'Train Name',
      'Train Type',
      'Severity',
      'Status',
      'Description',
      'Technician',
      'Expertise',
      'Reported Date',
      'Created At',
    ]);

    headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF2563EB' },
    };
    headerRow.alignment = { vertical: 'middle', horizontal: 'center' };

    reports?.forEach((report: any) => {
      const row = dataSheet.addRow([
        report.id,
        report.trains?.train_code || '-',
        report.trains?.name || '-',
        report.trains?.type || '-',
        report.severity,
        report.status,
        report.description,
        report.technicians?.name || 'Unassigned',
        report.technicians?.expertise || '-',
        new Date(report.reported_date).toLocaleString('id-ID'),
        new Date(report.created_at).toLocaleString('id-ID'),
      ]);

      const severityColors: Record<string, string> = {
        Low: 'FF3B82F6',
        Medium: 'FFEAB308',
        High: 'FFF97316',
        Critical: 'FFEF4444',
      };

      const severityCell = row.getCell(5);
      severityCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: severityColors[report.severity] || 'FFFFFFFF' },
      };
      severityCell.font = { color: { argb: 'FFFFFFFF' }, bold: true };
      severityCell.alignment = { vertical: 'middle', horizontal: 'center' };

      const statusColors: Record<string, string> = {
        Open: 'FF9CA3AF',
        'On Progress': 'FF3B82F6',
        Finished: 'FF22C55E',
      };

      const statusCell = row.getCell(6);
      statusCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: statusColors[report.status] || 'FFFFFFFF' },
      };
      statusCell.font = { color: { argb: 'FFFFFFFF' }, bold: true };
      statusCell.alignment = { vertical: 'middle', horizontal: 'center' };
    });

    dataSheet.columns.forEach((column) => {
      let maxLength = 0;
      column.eachCell?.({ includeEmpty: true }, (cell) => {
        const length = cell.value ? cell.value.toString().length : 10;
        if (length > maxLength) maxLength = length;
      });
      column.width = Math.min(maxLength + 2, 50);
    });

    const summarySheet = workbook.addWorksheet('Summary');

    const titleRow = summarySheet.addRow(['Crash Report Summary']);
    titleRow.font = { bold: true, size: 16 };
    summarySheet.mergeCells('A1:B1');
    summarySheet.addRow([]);

    summarySheet.addRow(['Total Reports', reports?.length || 0]);

    summarySheet.addRow([]);
    summarySheet.addRow(['Severity Distribution']);
    const severityCounts: Record<string, number> = {
      Low: 0,
      Medium: 0,
      High: 0,
      Critical: 0,
    };
    reports?.forEach((r: any) => {
      severityCounts[r.severity] = (severityCounts[r.severity] || 0) + 1;
    });
    Object.entries(severityCounts).forEach(([severity, count]) => {
      summarySheet.addRow([severity, count]);
    });

    summarySheet.addRow([]);
    summarySheet.addRow(['Status Distribution']);
    const statusCounts: Record<string, number> = {
      Open: 0,
      'On Progress': 0,
      Finished: 0,
    };
    reports?.forEach((r: any) => {
      statusCounts[r.status] = (statusCounts[r.status] || 0) + 1;
    });
    Object.entries(statusCounts).forEach(([status, count]) => {
      summarySheet.addRow([status, count]);
    });

    summarySheet.columns = [
      { width: 30 },
      { width: 15 },
    ];

    const buffer = await workbook.xlsx.writeBuffer();

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="crash-reports-${new Date()
          .toISOString()
          .split('T')[0]}.xlsx"`,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to generate Excel file' },
      { status: 500 }
    );
  }
}
