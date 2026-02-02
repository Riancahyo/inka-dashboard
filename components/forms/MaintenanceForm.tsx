"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import {
  createMaintenance,
  updateMaintenance,
  MaintenanceInsert,
} from "@/services/maintenance.service";
import { getAllTrains } from "@/services/laporan.service";
import { URGENCY_LEVELS } from "@/constants/severity";

const STATUS_OPTIONS = ["Pending", "In Progress", "Completed", "Cancelled"];

interface Train {
  id: string;
  train_code: string;
  name: string;
}

interface MaintenanceFormProps {
  initialData?: {
    id?: string;
    train_id?: string;
    maintenance_type?: string;
    urgency?: string;
    status?: string;
    schedule_date?: string;
  };
  isEdit?: boolean;
}

export function MaintenanceForm({
  initialData,
  isEdit = false,
}: MaintenanceFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [trains, setTrains] = useState<Train[]>([]);

  const [formData, setFormData] = useState({
    train_id: initialData?.train_id || "",
    maintenance_type: initialData?.maintenance_type || "",
    urgency: initialData?.urgency || "Low",
    status: initialData?.status || "Pending",
    schedule_date: initialData?.schedule_date
      ? new Date(initialData.schedule_date).toISOString().slice(0, 16)
      : new Date().toISOString().slice(0, 16),
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    async function loadTrains() {
      const trainsData = await getAllTrains();
      setTrains(trainsData);
    }
    loadTrains();
  }, []);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.train_id) newErrors.train_id = "Kereta harus dipilih";
    if (!formData.maintenance_type.trim())
      newErrors.maintenance_type = "Tipe maintenance harus diisi";
    if (!formData.urgency) newErrors.urgency = "Urgency harus dipilih";
    if (!formData.status) newErrors.status = "Status harus dipilih";
    if (!formData.schedule_date)
      newErrors.schedule_date = "Tanggal harus diisi";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    try {
      const payload: MaintenanceInsert = {
        train_id: formData.train_id,
        maintenance_type: formData.maintenance_type.trim(),
        urgency: formData.urgency,
        status: formData.status,
        schedule_date: new Date(formData.schedule_date).toISOString(),
      };

      let result;
      if (isEdit && initialData?.id) {
        result = await updateMaintenance(initialData.id, payload);
      } else {
        result = await createMaintenance(payload);
      }

      if (result.success) {
        router.push("/dashboard/maintenance");
        router.refresh();
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Terjadi kesalahan saat menyimpan data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEdit ? "Edit" : "Schedule"} Maintenance</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="train_id">
              Kereta <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.train_id}
              onValueChange={(value) => handleChange("train_id", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih kereta..." />
              </SelectTrigger>
              <SelectContent>
                {trains.map((train) => (
                  <SelectItem key={train.id} value={train.id}>
                    {train.train_code} - {train.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.train_id && (
              <p className="text-sm text-red-500">{errors.train_id}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="maintenance_type">
              Tipe Maintenance <span className="text-red-500">*</span>
            </Label>
            <Input
              id="maintenance_type"
              value={formData.maintenance_type}
              onChange={(e) => handleChange("maintenance_type", e.target.value)}
              placeholder="Contoh: Pengecekan Rem, Service Mesin, dll"
            />
            {errors.maintenance_type && (
              <p className="text-sm text-red-500">{errors.maintenance_type}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="urgency">
              Urgency <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.urgency}
              onValueChange={(value) => handleChange("urgency", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.values(URGENCY_LEVELS).map((level) => (
                  <SelectItem key={level} value={level}>
                    {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.urgency && (
              <p className="text-sm text-red-500">{errors.urgency}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">
              Status <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.status}
              onValueChange={(value) => handleChange("status", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.status && (
              <p className="text-sm text-red-500">{errors.status}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="schedule_date">
              Tanggal Jadwal <span className="text-red-500">*</span>
            </Label>
            <Input
              id="schedule_date"
              type="datetime-local"
              value={formData.schedule_date}
              onChange={(e) => handleChange("schedule_date", e.target.value)}
            />
            {errors.schedule_date && (
              <p className="text-sm text-red-500">{errors.schedule_date}</p>
            )}
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Menyimpan...
                </>
              ) : (
                <>{isEdit ? "Update" : "Schedule"} Maintenance</>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={loading}
            >
              Batal
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
