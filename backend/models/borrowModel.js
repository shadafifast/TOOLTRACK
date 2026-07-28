const pool = require('../config/database');

exports.findAll = async (filters, page = 1, limit = 10) => {
  let query = `
    SELECT b.id, b.tool_id as toolId, b.employee_id as employeeId, b.borrow_time as borrowTime, 
           b.estimated_return_date as estimatedReturnDate, b.return_time as returnTime, 
           b.duration, b.status, b.condition_on_return as conditionOnReturn, b.notes,
           t.name as toolName, u.name as employeeName, d.name as department
    FROM borrow_records b
    JOIN tools t ON b.tool_id = t.id
    JOIN users u ON b.employee_id = u.id
    LEFT JOIN departments d ON u.department_id = d.id
    WHERE 1=1
  `;
  const params = [];

  if (filters.search) {
    query += ' AND (t.name LIKE ? OR u.name LIKE ? OR b.id LIKE ?)';
    params.push(`%${filters.search}%`, `%${filters.search}%`, `%${filters.search}%`);
  }
  if (filters.status) {
    const statuses = filters.status.split(',');
    query += ` AND b.status IN (${statuses.map(() => '?').join(',')})`;
    params.push(...statuses);
  }
  if (filters.toolId) {
    query += ' AND b.tool_id = ?';
    params.push(filters.toolId);
  }
  if (filters.employeeId) {
    query += ' AND b.employee_id = ?';
    params.push(filters.employeeId);
  }

  const countQuery = query.replace(/SELECT b\.id.*?FROM/s, 'SELECT COUNT(*) as total FROM');
  const [[{ total }]] = await pool.execute(countQuery, params);

  const offset = (page - 1) * limit;
  query += ' ORDER BY b.borrow_time DESC LIMIT ? OFFSET ?';
  params.push(Number(limit), Number(offset));

  const [rows] = await pool.execute(query, params);
  return { data: rows, total, page, limit };
};

exports.findById = async (id) => {
  const [rows] = await pool.execute('SELECT * FROM borrow_records WHERE id = ?', [id]);
  return rows[0];
};

exports.create = async (data) => {
  const [result] = await pool.execute(
    'INSERT INTO borrow_records (id, tool_id, employee_id, estimated_return_date, notes) VALUES (?, ?, ?, ?, ?)',
    [data.id, data.toolId, data.employeeId, data.estimatedReturnDate || null, data.notes || null]
  );
  return result;
};

exports.updateReturn = async (id, data) => {
  const [result] = await pool.execute(
    'UPDATE borrow_records SET return_time = CURRENT_TIMESTAMP, status = "returned", condition_on_return = ?, notes = ?, duration = ? WHERE id = ?',
    [data.condition, data.notes || null, data.duration || null, id]
  );
  return result;
};

exports.generateNextId = async () => {
  const [rows] = await pool.execute('SELECT id FROM borrow_records ORDER BY id DESC LIMIT 1');
  if (rows.length === 0) return 'BR-001';
  const lastId = rows[0].id;
  const num = parseInt(lastId.replace('BR-', '')) + 1;
  return `BR-${num.toString().padStart(3, '0')}`;
};

exports.logActivity = async (type, toolId, userId, borrowRecordId, description) => {
  await pool.execute(
    'INSERT INTO activities (type, tool_id, user_id, borrow_record_id, description) VALUES (?, ?, ?, ?, ?)',
    [type, toolId, userId || null, borrowRecordId || null, description]
  );
};
