const pool = require('../config/database');

exports.findAll = async (filters, page = 1, limit = 10) => {
  let query = 'SELECT t.id, t.name, c.name as category, t.location, t.status, t.serial_number as serialNumber, t.purchase_date as purchaseDate, t.description, t.photo_url as photoUrl, t.last_user_id as lastUser, t.last_scan_time as lastScanTime FROM tools t LEFT JOIN tool_categories c ON t.category_id = c.id WHERE 1=1';
  const params = [];

  if (filters.search) {
    query += ' AND (t.name LIKE ? OR t.serial_number LIKE ?)';
    params.push(`%${filters.search}%`, `%${filters.search}%`);
  }
  if (filters.status) {
    query += ' AND t.status = ?';
    params.push(filters.status);
  }
  if (filters.category) {
    query += ' AND c.name = ?';
    params.push(filters.category);
  }

  const countQuery = query.replace('SELECT t.id, t.name, c.name as category, t.location, t.status, t.serial_number as serialNumber, t.purchase_date as purchaseDate, t.description, t.photo_url as photoUrl, t.last_user_id as lastUser, t.last_scan_time as lastScanTime', 'SELECT COUNT(*) as total');
  const [[{ total }]] = await pool.execute(countQuery, params);

  const offset = (page - 1) * limit;
  query += ' ORDER BY t.created_at DESC LIMIT ? OFFSET ?';
  
  // mysql2 prepared statements require numbers for LIMIT/OFFSET
  params.push(Number(limit), Number(offset)); 

  const [rows] = await pool.execute(query, params);
  
  return { data: rows, total, page, limit };
};

exports.findById = async (id) => {
  const [rows] = await pool.execute('SELECT t.id, t.name, c.name as category, t.location, t.status, t.serial_number as serialNumber, t.purchase_date as purchaseDate, t.description, t.photo_url as photoUrl, t.last_user_id as lastUser, t.last_scan_time as lastScanTime FROM tools t LEFT JOIN tool_categories c ON t.category_id = c.id WHERE t.id = ?', [id]);
  return rows[0];
};

exports.create = async (data) => {
  const [result] = await pool.execute(
    'INSERT INTO tools (id, name, category_id, location, serial_number, description, purchase_date) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [data.id, data.name, data.category_id, data.location, data.serialNumber, data.description || null, data.purchaseDate || null]
  );
  return result;
};

exports.update = async (id, data) => {
  const fields = [];
  const params = [];
  
  Object.keys(data).forEach(key => {
    fields.push(`${key} = ?`);
    params.push(data[key]);
  });
  
  if (fields.length === 0) return null;
  
  params.push(id);
  const [result] = await pool.execute(`UPDATE tools SET ${fields.join(', ')} WHERE id = ?`, params);
  return result;
};

exports.delete = async (id) => {
  // Hapus riwayat peminjaman terkait alat ini terlebih dahulu untuk menghindari error foreign key constraint
  await pool.execute('DELETE FROM borrow_records WHERE tool_id = ?', [id]);
  const [result] = await pool.execute('DELETE FROM tools WHERE id = ?', [id]);
  return result;
};

exports.getCategories = async () => {
  const [rows] = await pool.execute('SELECT * FROM tool_categories');
  return rows;
};

exports.getCategoryIdByName = async (name) => {
  if (!name) return null;
  // Coba parse sebagai angka dulu (jika dikirim ID langsung)
  const num = parseInt(name);
  if (!isNaN(num)) return num;
  // Cari berdasarkan nama
  const [rows] = await pool.execute('SELECT id FROM tool_categories WHERE name = ? LIMIT 1', [name]);
  return rows.length > 0 ? rows[0].id : null;
};

exports.getHistory = async (id) => {
  const query = `
    SELECT b.id, b.tool_id as toolId, b.employee_id as employeeId, b.borrow_time as borrowTime, 
           b.estimated_return_date as estimatedReturnDate, b.return_time as returnTime, 
           b.duration, b.status, b.condition_on_return as conditionOnReturn, b.notes,
           t.name as toolName, u.name as employeeName, d.name as department
    FROM borrow_records b
    JOIN tools t ON b.tool_id = t.id
    JOIN users u ON b.employee_id = u.id
    LEFT JOIN departments d ON u.department_id = d.id
    WHERE b.tool_id = ?
    ORDER BY b.borrow_time DESC
  `;
  const [rows] = await pool.execute(query, [id]);
  return rows;
};

exports.generateNextId = async () => {
  const [rows] = await pool.execute('SELECT id FROM tools ORDER BY id DESC LIMIT 1');
  if (rows.length === 0) return 'TL-001';
  const lastId = rows[0].id;
  const num = parseInt(lastId.replace('TL-', '')) + 1;
  return `TL-${num.toString().padStart(3, '0')}`;
};
