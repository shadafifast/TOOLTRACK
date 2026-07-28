const borrowModel = require('../models/borrowModel');
const toolModel = require('../models/toolModel');
const userModel = require('../models/userModel');

exports.getAllBorrows = async (query) => {
  const filters = {
    search: query.search || '',
    status: query.status || '',
    toolId: query.toolId || '',
    employeeId: query.employeeId || ''
  };
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 10;

  return borrowModel.findAll(filters, page, limit);
};

exports.createBorrow = async (data, isQuick = false) => {
  const tool = await toolModel.findById(data.toolId);
  if (!tool) throw { statusCode: 404, message: 'Alat tidak ditemukan' };
  if (tool.status !== 'available') throw { statusCode: 400, message: 'Alat tidak tersedia untuk dipinjam' };

  const user = await userModel.findById(data.employeeId);
  if (!user) throw { statusCode: 404, message: 'Karyawan tidak ditemukan' };

  const nextId = await borrowModel.generateNextId();
  
  let estimatedReturnDate = data.estimatedReturnDate;
  if (!estimatedReturnDate) {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    estimatedReturnDate = date.toISOString().split('T')[0];
  }

  await borrowModel.create({
    id: nextId,
    toolId: data.toolId,
    employeeId: data.employeeId,
    estimatedReturnDate,
    notes: data.notes || (isQuick ? 'Quick scan borrow' : null)
  });

  await toolModel.update(data.toolId, { status: 'borrowed', last_user_id: data.employeeId });

  await borrowModel.logActivity(
    'borrow', 
    data.toolId, 
    data.employeeId, 
    nextId, 
    `${user.name} meminjam ${tool.name}`
  );

  return borrowModel.findById(nextId);
};

exports.returnBorrow = async (id, data, currentUser) => {
  const borrow = await borrowModel.findById(id);
  if (!borrow) throw { statusCode: 404, message: 'Data peminjaman tidak ditemukan' };
  if (borrow.status === 'returned') throw { statusCode: 400, message: 'Alat sudah dikembalikan sebelumnya' };

  const tool = await toolModel.findById(borrow.tool_id);
  const user = await userModel.findById(borrow.employee_id);

  const borrowDate = new Date(borrow.borrow_time);
  const returnDate = new Date();
  const diffTime = Math.abs(returnDate - borrowDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const duration = `${diffDays} Hari`;

  await borrowModel.updateReturn(id, {
    condition: data.condition,
    notes: data.notes,
    duration
  });

  let nextToolStatus = 'available';
  if (data.condition === 'damaged') {
    nextToolStatus = 'damaged';
  }

  await toolModel.update(borrow.tool_id, { status: nextToolStatus });

  await borrowModel.logActivity(
    'return', 
    borrow.tool_id, 
    currentUser ? currentUser.id : borrow.employee_id, 
    id, 
    `${user.name} mengembalikan ${tool.name} dengan kondisi ${data.condition}`
  );

  return borrowModel.findById(id);
};
