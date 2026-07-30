const borrowService = require('../services/borrowService');
const { successResponse } = require('../helpers/response');
const { createBorrowSchema, returnBorrowSchema } = require('../validation/borrowValidation');
const PDFDocument = require('pdfkit');

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
    if (format !== 'csv' && format !== 'pdf') {
       return res.status(400).json({ success: false, message: 'Format tidak didukung' });
    }
    
    const result = await borrowService.getAllBorrows({ limit: 10000 });
    const records = result.data;
    
    if (format === 'csv') {
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
      
      const csvString = csvRows.join('\n');
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=riwayat-peminjaman.csv');
      return res.status(200).send(csvString);
    }
    
    if (format === 'pdf') {
      const doc = new PDFDocument({ margin: 30, size: 'A4' });
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=riwayat-peminjaman.pdf');
      
      doc.pipe(res);
      
      // Header Document
      doc.rect(0, 0, 595.28, 70).fill('#1E293B');
      
      doc.fillColor('#FFFFFF').fontSize(16).font('Helvetica-Bold').text('LAPORAN RIWAYAT PEMINJAMAN ALAT', 30, 20);
      doc.fillColor('#94A3B8').fontSize(9).font('Helvetica').text(`Generated on: ${new Date().toLocaleString('id-ID')}`, 30, 42);
      
      // Table configuration
      const headers = ['ID', 'Karyawan & Dept', 'Nama Alat', 'Tgl Pinjam', 'Tgl Kembali', 'Status'];
      const colWidths = [45, 120, 120, 90, 90, 70]; // Total = 535
      
      let y = 90;
      
      // Render Table Headers
      doc.rect(30, y, 535, 22).fill('#2563EB');
      doc.fillColor('#FFFFFF').fontSize(8.5).font('Helvetica-Bold');
      
      let headerX = 30;
      headers.forEach((h, i) => {
        doc.text(h, headerX + 5, y + 7, { width: colWidths[i] - 10, align: 'left' });
        headerX += colWidths[i];
      });
      
      y += 22;
      
      // Render Table Data
      records.forEach((r, rowIndex) => {
        // Page break check (A4 is 841.89 high, margin 30)
        if (y > 780) {
          doc.addPage();
          y = 30;
          
          // Re-render headers on new page
          doc.rect(30, y, 535, 22).fill('#2563EB');
          doc.fillColor('#FFFFFF').fontSize(8.5).font('Helvetica-Bold');
          
          let pageHeaderX = 30;
          headers.forEach((h, i) => {
            doc.text(h, pageHeaderX + 5, y + 7, { width: colWidths[i] - 10, align: 'left' });
            pageHeaderX += colWidths[i];
          });
          
          y += 22;
        }
        
        // Alternating row background
        if (rowIndex % 2 === 0) {
          doc.rect(30, y, 535, 24).fill('#F8FAFC');
        } else {
          doc.rect(30, y, 535, 24).fill('#FFFFFF');
        }
        
        // Border bottom for rows
        doc.rect(30, y + 23, 535, 1).fill('#E2E8F0');
        
        doc.fillColor('#334155').fontSize(8).font('Helvetica');
        let rowX = 30;
        
        // ID
        doc.font('Helvetica-Bold').fillColor('#2563EB').text(r.id, rowX + 5, y + 8, { width: colWidths[0] - 10 });
        rowX += colWidths[0];
        
        // Karyawan & Dept
        doc.font('Helvetica').fillColor('#1E293B').text(r.employeeName, rowX + 5, y + 4, { width: colWidths[1] - 10 });
        doc.fillColor('#64748B').fontSize(7.5).text(r.department || '-', rowX + 5, y + 13, { width: colWidths[1] - 10 });
        rowX += colWidths[1];
        
        // Nama Alat
        doc.fontSize(8).fillColor('#1E293B').text(r.toolName, rowX + 5, y + 8, { width: colWidths[2] - 10, ellipsis: true });
        rowX += colWidths[2];
        
        // Tgl Pinjam
        const bTime = r.borrowTime ? new Date(r.borrowTime).toLocaleDateString('id-ID') : '-';
        doc.text(bTime, rowX + 5, y + 8, { width: colWidths[3] - 10 });
        rowX += colWidths[3];
        
        // Tgl Kembali
        const rTime = r.returnTime ? new Date(r.returnTime).toLocaleDateString('id-ID') : '-';
        doc.text(rTime, rowX + 5, y + 8, { width: colWidths[4] - 10 });
        rowX += colWidths[4];
        
        // Status Badge
        const statusText = r.status.toUpperCase();
        let badgeColor = '#3B82F6'; // active
        if (r.status === 'overdue') badgeColor = '#EF4444';
        if (r.status === 'returned') badgeColor = '#10B981';
        
        doc.font('Helvetica-Bold').fillColor(badgeColor).text(statusText, rowX + 5, y + 8, { width: colWidths[5] - 10 });
        
        y += 24;
      });
      
      doc.end();
    }
  } catch (error) {
    next(error);
  }
};
