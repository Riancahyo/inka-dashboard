"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  createLaporan,
  updateLaporan,
  getAllTrains,
  getAllTechnicians,
} from "@/services/laporan.service";
import { SEVERITY_LEVELS, STATUS_OPTIONS } from "@/constants/severity";
import { LaporanInsert } from "@/types/laporan";

interface LaporanFormProps {
  initialData?: LaporanInsert;
  isEdit?: boolean;
}

export function LaporanForm({ initialData, isEdit = false }: LaporanFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  interface Train {
    id: string; 
    train_code: string;
    name: string;
  }

  const [trains, setTrains] = useState<Train[]>([]);
  interface Technician {
    id: string; 
    name: string;
    expertise: string; 
  }

  const [technicians, setTechnicians] = useState<Technician[]>([]);

  const [formData, setFormData] = useState({
    train_id: initialData?.train_id || "",
    technician_id: initialData?.technician_id || "",
    severity: initialData?.severity || "Low",
    status: initialData?.status || "Open",
    description: initialData?.description || "",
    photo_url: initialData?.photo_url || "",
    reported_date: initialData?.reported_date
      ? new Date(initialData.reported_date).toISOString().slice(0, 16)
      : new Date().toISOString().slice(0, 16),
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    async function loadData() {
      const [trainsData, techniciansData] = await Promise.all([
        getAllTrains(),
        getAllTechnicians(),
      ]);
      setTrains(trainsData);
      setTechnicians(techniciansData);
    }
    loadData();
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
    if (!formData.severity) newErrors.severity = "Severity harus dipilih";
    if (!formData.status) newErrors.status = "Status harus dipilih";
    if (!formData.description.trim())
      newErrors.description = "Deskripsi harus diisi";
    if (!formData.reported_date)
      newErrors.reported_date = "Tanggal harus diisi";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    try {
      const payload: LaporanInsert = {
        train_id: formData.train_id,
        technician_id: formData.technician_id === "none" || formData.technician_id === "" 
            ? null 
            : formData.technician_id,
        severity: formData.severity,
        status: formData.status,
        description: formData.description,
        photo_url: formData.photo_url || null,
        reported_date: new Date(formData.reported_date).toISOString(),
      };

      let result;
      if (isEdit && initialData?.id) {
        result = await updateLaporan(initialData.id, payload);
      } else {
        result = await createLaporan(payload);
      }

      if (result.success) {
        router.push("/dashboard/laporan");
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
        <CardTitle>{isEdit ? "Edit" : "Tambah"} Laporan Kerusakan</CardTitle>
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
            <Label htmlFor="technician_id">Teknisi (Opsional)</Label>
            <Select
              value={formData.technician_id}
              onValueChange={(value) => handleChange("technician_id", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih teknisi..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Tidak ada</SelectItem>
                {technicians.map((tech) => (
                  <SelectItem key={tech.id} value={tech.id}>
                    {tech.name} ({tech.expertise})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="severity">
              Severity <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.severity}
              onValueChange={(value) => handleChange("severity", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.values(SEVERITY_LEVELS).map((level) => (
                  <SelectItem key={level} value={level}>
                    {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.severity && (
              <p className="text-sm text-red-500">{errors.severity}</p>
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
                {Object.values(STATUS_OPTIONS).map((status) => (
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
            <Label htmlFor="description">
              Deskripsi <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                handleChange("description", e.target.value)
              }
              placeholder="Jelaskan kerusakan yang terjadi..."
              rows={4}
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="photo_url">URL Foto (Opsional)</Label>
            <Input
              id="photo_url"
              type="url"
              value={formData.photo_url}
              onChange={(e) => handleChange("photo_url", e.target.value)}
              placeholder="https://example.com/photo.jpg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reported_date">
              Tanggal Kejadian <span className="text-red-500">*</span>
            </Label>
            <Input
              id="reported_date"
              type="datetime-local"
              value={formData.reported_date}
              onChange={(e) => handleChange("reported_date", e.target.value)}
            />
            {errors.reported_date && (
              <p className="text-sm text-red-500">{errors.reported_date}</p>
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
                <>{isEdit ? "Update" : "Simpan"} Laporan</>
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
