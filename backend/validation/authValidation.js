const { z } = require('zod');

exports.registerSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  email: z.string().email("Format email tidak valid"),
  department: z.string().min(1, "Departemen wajib diisi").or(z.number()),
  position: z.string().min(1, "Jabatan wajib diisi"),
  phone: z.string().optional(),
  password: z.string().min(8, "Password minimal 8 karakter")
});

exports.loginSchema = z.object({
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(1, "Password wajib diisi")
});
