const pool = require('../config/database');

exports.findByEmail = async (email) => {
  const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0];
};

exports.findById = async (id) => {
  const [rows] = await pool.execute('SELECT * FROM users WHERE id = ?', [id]);
  return rows[0];
};

exports.createUser = async (userData) => {
  const { id, name, email, password_hash, department_id, position, phone, avatar, role } = userData;
  const [result] = await pool.execute(
    'INSERT INTO users (id, name, email, role, password_hash, department_id, position, phone, avatar) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [id, name, email, role, password_hash, department_id, position, phone, avatar]
  );
  return result;
};

exports.generateNextId = async () => {
  const [rows] = await pool.execute('SELECT id FROM users ORDER BY id DESC LIMIT 1');
  if (rows.length === 0) return 'EMP001';
  const lastId = rows[0].id;
  const num = parseInt(lastId.replace('EMP', '')) + 1;
  return `EMP${num.toString().padStart(3, '0')}`;
};
