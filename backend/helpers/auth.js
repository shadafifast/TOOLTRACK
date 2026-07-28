const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

exports.comparePassword = async (password, hash) => {
  return bcrypt.compare(password, hash);
};

exports.generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, department: user.department_id },
    process.env.JWT_SECRET || 'secret',
    { expiresIn: '1d' }
  );
};
