import * as z from "zod";

export const keretaSchema = z.object({
  nama: z.string(),
  nomor: z.string(),
  jenis: z.string(),
  tahun: z.number().min(1900).max(2100),
});
