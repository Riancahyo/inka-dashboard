import Link from "next/link";
import { notFound } from "next/navigation";
import { Pencil, ArrowLeft, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { PageContainer } from "@/components/layout/PageContainer";
import { formatDate } from "@/lib/utils";
import { SEVERITY_COLORS, STATUS_COLORS } from "@/constants/severity";
import { getTechnicianById } from "@/services/teknisi.service";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface CrashReport {
  id: string;
  reported_date: string;
  trains?: {
    train_code: string;
    name: string;
  };
  severity: string;
  status: string;
  description: string;
}

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function TeknisiDetailPage({ params }: PageProps) {
  const { id } = await params;
  const technician = await getTechnicianById(id);

  if (!technician) {
    notFound();
  }

  const getPerformanceBadge = (score: number) => {
    if (score >= 80) return "bg-green-100 text-green-800 border-green-200";
    if (score >= 60) return "bg-yellow-100 text-yellow-800 border-yellow-200";
    if (score >= 40) return "bg-orange-100 text-orange-800 border-orange-200";
    return "bg-red-100 text-red-800 border-red-200";
  };

  return (
    <PageContainer
      title="Detail Teknisi"
      action={
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/dashboard/teknisi">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali
            </Link>
          </Button>
          <Button asChild>
            <Link href={`/dashboard/teknisi/${id}/edit`}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Profil Teknisi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-3">
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Nama Lengkap
                </label>
                <p className="mt-1 text-lg font-semibold">{technician.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Keahlian
                </label>
                <div className="mt-1">
                  <Badge variant="secondary" className="text-base">
                    {technician.expertise}
                  </Badge>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Contact
                </label>
                <p className="mt-1">{technician.contact}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <p className="text-sm font-medium text-gray-600">Laporan Aktif</p>
              <h3 className="mt-2 text-3xl font-bold text-blue-600">
                {technician.stats?.active_reports || 0}
              </h3>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <p className="text-sm font-medium text-gray-600">
                Total Ditugaskan
              </p>
              <h3 className="mt-2 text-3xl font-bold">
                {technician.stats?.total_assigned || 0}
              </h3>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <p className="text-sm font-medium text-gray-600">Selesai</p>
              <h3 className="mt-2 text-3xl font-bold text-green-600">
                {technician.stats?.completed_reports || 0}
              </h3>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <p className="text-sm font-medium text-gray-600">
                Performance Score
              </p>
              <div className="mt-2 space-y-2">
                <Progress
                  value={technician.stats?.performance_score || 0}
                  className="h-3"
                />
                <Badge
                  variant="outline"
                  className={`text-base ${getPerformanceBadge(
                    technician.stats?.performance_score || 0,
                  )}`}
                >
                  <TrendingUp className="mr-1 h-4 w-4" />
                  {technician.stats?.performance_score || 0}%
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Laporan yang Ditangani</CardTitle>
          </CardHeader>
          <CardContent>
            {technician.crash_reports && technician.crash_reports.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Kode Kereta</TableHead>
                    <TableHead>Nama Kereta</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Deskripsi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {technician.crash_reports.map((report: CrashReport) => (
                    <TableRow key={report.id}>
                      <TableCell className="text-sm">
                        {formatDate(report.reported_date)}
                      </TableCell>
                      <TableCell>
                        <span className="font-mono font-semibold text-blue-600">
                          {report.trains?.train_code || "N/A"}
                        </span>
                      </TableCell>
                      <TableCell>{report.trains?.name || "Unknown"}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            SEVERITY_COLORS[
                              report.severity as keyof typeof SEVERITY_COLORS
                            ]
                          }
                        >
                          {report.severity}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            STATUS_COLORS[
                              report.status as keyof typeof STATUS_COLORS
                            ]
                          }
                        >
                          {report.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-xs truncate text-sm">
                        {report.description}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="py-8 text-center text-gray-500">
                Belum ada laporan yang ditugaskan
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
