const { z } = require('zod');

exports.createToolSchema = z.object({
  name: z.string().min(1, "Nama alat wajib diisi"),
  serialNumber: z.string().min(1, "Nomor seri wajib diisi"),
  category: z.string().or(z.number()),
  location: z.string().min(1, "Lokasi wajib diisi"),
  description: z.string().optional().nullable(),
  purchaseDate: z.string().optional().nullable()
});

exports.updateToolSchema = z.object({
  name: z.string().min(1).optional(),
  serialNumber: z.string().min(1).optional(),
  category: z.string().or(z.number()).optional(),
  location: z.string().min(1).optional(),
  description: z.string().optional().nullable(),
  purchaseDate: z.string().optional().nullable(),
  status: z.enum(['available', 'borrowed', 'overdue', 'damaged']).optional(),
  photoUrl: z.string().optional().nullable(),
});

