"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { createTechnician, updateTechnician } from "@/services/teknisi.service";
import { TechnicianInsert } from "@/types/teknisi";

interface Technician extends TechnicianInsert {
  id: string;
}

interface TeknisiFormProps {
  initialData?: Technician;
  isEdit?: boolean;
}

export function TeknisiForm({ initialData, isEdit = false }: TeknisiFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    expertise: initialData?.expertise || "",
    contact: initialData?.contact || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Nama harus diisi";
    if (!formData.expertise.trim())
      newErrors.expertise = "Keahlian harus diisi";
    if (!formData.contact.trim()) newErrors.contact = "Contact harus diisi";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    try {
      const payload: TechnicianInsert = {
        name: formData.name.trim(),
        expertise: formData.expertise.trim(),
        contact: formData.contact.trim(),
      };

      let result;
      if (isEdit && initialData?.id) {
        result = await updateTechnician(initialData.id, payload);
      } else {
        result = await createTechnician(payload);
      }

      if (result.success) {
        router.push("/dashboard/teknisi");
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
        <CardTitle>{isEdit ? "Edit" : "Tambah"} Teknisi</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">
              Nama Lengkap <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Budi Santoso"
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="expertise">
              Keahlian <span className="text-red-500">*</span>
            </Label>
            <Input
              id="expertise"
              value={formData.expertise}
              onChange={(e) => handleChange("expertise", e.target.value)}
              placeholder="Contoh: Mechanical, Electrical, Hydraulic"
            />
            {errors.expertise && (
              <p className="text-sm text-red-500">{errors.expertise}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact">
              Contact <span className="text-red-500">*</span>
            </Label>
            <Input
              id="contact"
              value={formData.contact}
              onChange={(e) => handleChange("contact", e.target.value)}
              placeholder="08123456789"
            />
            {errors.contact && (
              <p className="text-sm text-red-500">{errors.contact}</p>
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
                <>{isEdit ? "Update" : "Simpan"} Teknisi</>
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
