const pool = require('../config/database');

exports.findAll = async (search, department) => {
  let query = 'SELECT id, name, email, department_id, position, phone, avatar FROM users WHERE 1=1';
  const params = [];
  
  if (department) {
    query = 'SELECT u.id, u.name, u.email, d.name as department, u.position, u.phone, u.avatar FROM users u LEFT JOIN departments d ON u.department_id = d.id WHERE 1=1';
    if (search) {
      query += ' AND u.name LIKE ?';
      params.push(`%${search}%`);
    }
    query += ' AND d.id = ?';
    params.push(department);
  } else {
    query = 'SELECT u.id, u.name, u.email, d.name as department, u.position, u.phone, u.avatar FROM users u LEFT JOIN departments d ON u.department_id = d.id WHERE 1=1';
    if (search) {
      query += ' AND u.name LIKE ?';
      params.push(`%${search}%`);
    }
  }

  const [rows] = await pool.execute(query, params);
  return rows;
};

exports.findById = async (id) => {
  const [rows] = await pool.execute('SELECT u.id, u.name, u.email, d.name as department, u.position, u.phone, u.avatar FROM users u LEFT JOIN departments d ON u.department_id = d.id WHERE u.id = ?', [id]);
  return rows[0];
};

exports.getDepartments = async () => {
  const [rows] = await pool.execute('SELECT * FROM departments');
  return rows;
};
