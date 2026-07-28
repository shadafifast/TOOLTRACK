const { z } = require('zod');

exports.createBorrowSchema = z.object({
  toolId: z.string().min(1, "Tool ID wajib diisi"),
  employeeId: z.string().min(1, "Employee ID wajib diisi"),
  estimatedReturnDate: z.string().optional(),
  notes: z.string().optional()
});

exports.returnBorrowSchema = z.object({
  condition: z.enum(['excellent', 'good', 'fair', 'damaged']),
  notes: z.string().optional()
});
