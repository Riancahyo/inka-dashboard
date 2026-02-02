import Link from "next/link";
import { notFound } from "next/navigation";
import { Pencil, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageContainer } from "@/components/layout/PageContainer";
import { formatDateTime } from "@/lib/utils";
import { URGENCY_COLORS } from "@/constants/severity";
import { getMaintenanceById } from "@/services/maintenance.service";

const STATUS_COLORS: Record<string, string> = {
  Pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  "In Progress": "bg-blue-100 text-blue-800 border-blue-200",
  Completed: "bg-green-100 text-green-800 border-green-200",
  Cancelled: "bg-gray-100 text-gray-800 border-gray-200",
};

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function MaintenanceDetailPage({ params }: PageProps) {
  const { id } = await params;
  const maintenance = await getMaintenanceById(id);

  if (!maintenance) {
    notFound();
  }

  const isOverdue =
    new Date(maintenance.schedule_date) < new Date() &&
    maintenance.status === "Pending";

  return (
    <PageContainer
      title="Detail Maintenance"
      action={
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/dashboard/maintenance">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali
            </Link>
          </Button>
          <Button asChild>
            <Link href={`/dashboard/maintenance/${id}/edit`}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </Button>
        </div>
      }
    >
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Informasi Maintenance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">
                ID Maintenance
              </label>
              <p className="mt-1 text-sm font-mono">{maintenance.id}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">
                Tipe Maintenance
              </label>
              <p className="mt-1 font-medium">{maintenance.maintenance_type}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">
                Urgency
              </label>
              <div className="mt-1">
                <Badge
                  variant="outline"
                  className={
                    URGENCY_COLORS[
                      maintenance.urgency as keyof typeof URGENCY_COLORS
                    ]
                  }
                >
                  {maintenance.urgency}
                </Badge>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">
                Status
              </label>
              <div className="mt-1">
                <Badge
                  variant="outline"
                  className={STATUS_COLORS[maintenance.status]}
                >
                  {maintenance.status}
                </Badge>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">
                Tanggal Jadwal
              </label>
              <p className="mt-1">
                {formatDateTime(maintenance.schedule_date)}
              </p>
              {isOverdue && (
                <p className="mt-1 text-sm font-medium text-red-600">
                  ⚠️ Overdue
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">
                Dibuat
              </label>
              <p className="mt-1 text-sm text-gray-600">
                {formatDateTime(maintenance.created_at)}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Informasi Kereta</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">
                Kode Kereta
              </label>
              <p className="mt-1 font-mono text-lg font-semibold text-blue-600">
                {maintenance.trains?.train_code || "N/A"}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">
                Nama Kereta
              </label>
              <p className="mt-1 font-medium">
                {maintenance.trains?.name || "Unknown"}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Tipe</label>
              <div className="mt-1">
                <Badge variant="secondary">
                  {maintenance.trains?.type || "-"}
                </Badge>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Tahun</label>
              <p className="mt-1">{(maintenance.trains as any)?.year || "-"}</p>
            </div>

            <div className="pt-4">
              <Button asChild variant="outline" className="w-full">
                <Link href={`/dashboard/kereta/${maintenance.train_id}`}>
                  Lihat Detail Kereta
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
