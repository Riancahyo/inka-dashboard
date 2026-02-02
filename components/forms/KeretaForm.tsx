"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { createTrain, updateTrain } from "@/services/kereta.service";
import { TrainInsert, Train } from "@/types/kereta";

interface KeretaFormProps {
  initialData?: Train;
  isEdit?: boolean;
}

export function KeretaForm({ initialData, isEdit = false }: KeretaFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    train_code: initialData?.train_code || "",
    name: initialData?.name || "",
    type: initialData?.type || "",
    year: initialData?.year || new Date().getFullYear(),
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.train_code.trim())
      newErrors.train_code = "Kode kereta harus diisi";
    if (!formData.name.trim()) newErrors.name = "Nama kereta harus diisi";
    if (!formData.type.trim()) newErrors.type = "Tipe kereta harus diisi";
    if (!formData.year || formData.year < 1900 || formData.year > 2100)
      newErrors.year = "Tahun produksi tidak valid";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    try {
      const payload: TrainInsert = {
        train_code: formData.train_code.trim(),
        name: formData.name.trim(),
        type: formData.type.trim(),
        year: Number(formData.year),
      };

      let result;
      if (isEdit && initialData?.id) {
        result = await updateTrain(initialData.id, payload);
      } else {
        result = await createTrain(payload);
      }

      if (result.success) {
        router.push("/dashboard/kereta");
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
        <CardTitle>{isEdit ? "Edit" : "Tambah"} Kereta</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="train_code">
              Kode Kereta <span className="text-red-500">*</span>
            </Label>
            <Input
              id="train_code"
              value={formData.train_code}
              onChange={(e) => handleChange("train_code", e.target.value)}
              placeholder="KRL-001"
            />
            {errors.train_code && (
              <p className="text-sm text-red-500">{errors.train_code}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">
              Nama Kereta <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Commuter Line Series 1"
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">
              Tipe <span className="text-red-500">*</span>
            </Label>
            <Input
              id="type"
              value={formData.type}
              onChange={(e) => handleChange("type", e.target.value)}
              placeholder="KRL, LRT, MRT, dll"
            />
            {errors.type && (
              <p className="text-sm text-red-500">{errors.type}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="year">
              Tahun Produksi <span className="text-red-500">*</span>
            </Label>
            <Input
              id="year"
              type="number"
              value={formData.year}
              onChange={(e) => handleChange("year", parseInt(e.target.value))}
              min={1900}
              max={2100}
            />
            {errors.year && (
              <p className="text-sm text-red-500">{errors.year}</p>
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
                <>{isEdit ? "Update" : "Simpan"} Kereta</>
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
