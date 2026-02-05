import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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

    const severityCounts: Record<string, number> = {
      Low: 0,
      Medium: 0,
      High: 0,
      Critical: 0,
    };

    const statusCounts: Record<string, number> = {
      Open: 0,
      'On Progress': 0,
      Finished: 0,
    };

    reports?.forEach((r: any) => {
      severityCounts[r.severity] = (severityCounts[r.severity] || 0) + 1;
      statusCounts[r.status] = (statusCounts[r.status] || 0) + 1;
    });

    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('PT INKA - Crash Report Summary', 105, 20, { align: 'center' });

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(
      `Generated: ${new Date().toLocaleString('id-ID')}`,
      105,
      27,
      { align: 'center' }
    );

    let yPosition = 40;

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Summary Statistics', 20, yPosition);
    yPosition += 7;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Total Reports: ${reports?.length || 0}`, 20, yPosition);
    yPosition += 10;

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Severity Distribution:', 20, yPosition);
    yPosition += 5;

    autoTable(doc, {
      startY: yPosition,
      head: [['Severity', 'Count']],
      body: Object.entries(severityCounts).map(([severity, count]) => [
        severity,
        count.toString(),
      ]),
      theme: 'grid',
      headStyles: { fillColor: [37, 99, 235], textColor: 255 },
      margin: { left: 20 },
      columnStyles: {
        0: { cellWidth: 60 },
        1: { cellWidth: 40, halign: 'center' },
      },
    });

    yPosition = (doc as any).lastAutoTable.finalY + 10;

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Status Distribution:', 20, yPosition);
    yPosition += 5;

    autoTable(doc, {
      startY: yPosition,
      head: [['Status', 'Count']],
      body: Object.entries(statusCounts).map(([status, count]) => [
        status,
        count.toString(),
      ]),
      theme: 'grid',
      headStyles: { fillColor: [37, 99, 235], textColor: 255 },
      margin: { left: 20 },
      columnStyles: {
        0: { cellWidth: 60 },
        1: { cellWidth: 40, halign: 'center' },
      },
    });

    doc.addPage();

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Detailed Reports', 20, 20);

    const tableData =
      reports?.map((report: any) => [
        report.trains?.train_code || '-',
        report.trains?.name || '-',
        report.severity,
        report.status,
        report.technicians?.name || 'Unassigned',
        new Date(report.reported_date).toLocaleDateString('id-ID'),
      ]) || [];

    autoTable(doc, {
      startY: 27,
      head: [
        [
          'Train Code',
          'Train Name',
          'Severity',
          'Status',
          'Technician',
          'Date',
        ],
      ],
      body: tableData,
      theme: 'grid',
      styles: { fontSize: 8 },
      headStyles: { fillColor: [37, 99, 235], textColor: 255 },
      columnStyles: {
        0: { cellWidth: 25 },
        1: { cellWidth: 45 },
        2: { cellWidth: 25, halign: 'center' },
        3: { cellWidth: 25, halign: 'center' },
        4: { cellWidth: 35 },
        5: { cellWidth: 25, halign: 'center' },
      },
      didParseCell: (data: any) => {
        if (data.section === 'body' && data.column.index === 2) {
          const severity = data.cell.raw;
          const severityColors: Record<string, [number, number, number]> = {
            Low: [59, 130, 246],
            Medium: [234, 179, 8],
            High: [249, 115, 22],
            Critical: [239, 68, 68],
          };
          if (severityColors[severity]) {
            data.cell.styles.fillColor = severityColors[severity];
            data.cell.styles.textColor = [255, 255, 255];
          }
        }

        if (data.section === 'body' && data.column.index === 3) {
          const status = data.cell.raw;
          const statusColors: Record<string, [number, number, number]> = {
            Open: [156, 163, 175],
            'On Progress': [59, 130, 246],
            Finished: [34, 197, 94],
          };
          if (statusColors[status]) {
            data.cell.styles.fillColor = statusColors[status];
            data.cell.styles.textColor = [255, 255, 255];
          }
        }
      },
    });

    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.text(`Page ${i} of ${pageCount}`, 105, 290, { align: 'center' });
    }

    const pdfBuffer = Buffer.from(doc.output('arraybuffer'));

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="crash-reports-${new Date()
          .toISOString()
          .split('T')[0]}.pdf"`,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to generate PDF file', details: error.message },
      { status: 500 }
    );
  }
}
