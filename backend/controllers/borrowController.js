const borrowService = require('../services/borrowService');
const { successResponse } = require('../helpers/response');
const { createBorrowSchema, returnBorrowSchema } = require('../validation/borrowValidation');

exports.getAllBorrows = async (req, res, next) => {
  try {
    const result = await borrowService.getAllBorrows(req.query);
    return successResponse(res, result, 'Data riwayat peminjaman berhasil diambil');
  } catch (error) {
    next(error);
  }
};

exports.createBorrow = async (req, res, next) => {
  try {
    const validatedData = createBorrowSchema.parse(req.body);
    const result = await borrowService.createBorrow(validatedData);
    return successResponse(res, result, 'Peminjaman berhasil dicatat', 201);
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ success: false, message: 'Validasi gagal', errors: error.errors });
    }
    next(error);
  }
};

exports.quickBorrow = async (req, res, next) => {
  try {
    const validatedData = createBorrowSchema.parse(req.body);
    const result = await borrowService.createBorrow(validatedData, true);
    return successResponse(res, result, 'Peminjaman cepat berhasil', 201);
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ success: false, message: 'Validasi gagal', errors: error.errors });
    }
    next(error);
  }
};

exports.returnBorrow = async (req, res, next) => {
  try {
    const validatedData = returnBorrowSchema.parse(req.body);
    const result = await borrowService.returnBorrow(req.params.id, validatedData, req.user);
    return successResponse(res, result, 'Pengembalian berhasil dicatat');
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ success: false, message: 'Validasi gagal', errors: error.errors });
    }
    next(error);
  }
};

exports.exportBorrows = async (req, res, next) => {
  try {
    const format = req.query.format;
    if (format !== 'csv') {
       return res.status(400).json({ success: false, message: 'Format tidak didukung' });
    }
    
    const result = await borrowService.getAllBorrows({ limit: 10000 });
    const records = result.data;
    
    const fields = ['ID', 'Alat', 'Karyawan', 'Departemen', 'Waktu Pinjam', 'Batas Kembali', 'Waktu Kembali', 'Durasi', 'Status', 'Kondisi'];
    const csvRows = [fields.join(',')];
    
    records.forEach(r => {
      const row = [
        r.id, 
        `"${r.toolName}"`, 
        `"${r.employeeName}"`, 
        `"${r.department}"`, 
        `"${r.borrowTime}"`,
        `"${r.estimatedReturnDate}"`,
        `"${r.returnTime || '-'}"`,
        `"${r.duration || '-'}"`,
        r.status,
        r.conditionOnReturn || '-'
      ];
      csvRows.push(row.join(','));
    });
    
    const csvString = csvRows.join('\\n');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=riwayat-peminjaman.csv');
    res.status(200).send(csvString);
  } catch (error) {
    next(error);
  }
};
