import * as z from "zod";

export const laporanSchema = z.object({
  kereta_id: z.string(),
  teknisi_id: z.string(),
  judul: z.string().min(3),
  deskripsi: z.string().min(10),
  tingkat_keparahan: z.enum(["rendah", "sedang", "tinggi"]),
  status: z.enum(["open", "progress", "done"]).default("open"),
});
