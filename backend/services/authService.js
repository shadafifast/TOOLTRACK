const userModel = require('../models/userModel');
const { hashPassword, comparePassword, generateToken } = require('../helpers/auth');

exports.register = async (data) => {
  const existingUser = await userModel.findByEmail(data.email);
  if (existingUser) {
    throw { statusCode: 400, message: 'Email sudah terdaftar' };
  }

  const nextId = await userModel.generateNextId();
  const password_hash = await hashPassword(data.password);
  
  const initials = data.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  const newUser = {
    id: nextId,
    name: data.name,
    email: data.email,
    password_hash,
    department_id: parseInt(data.department), 
    position: data.position,
    phone: data.phone || null,
    avatar: initials
  };

  await userModel.createUser(newUser);

  const userForToken = { id: newUser.id, email: newUser.email, department_id: newUser.department_id };
  const token = generateToken(userForToken);

  return { token, user: { id: newUser.id, name: newUser.name, email: newUser.email, position: newUser.position, avatar: newUser.avatar } };
};

exports.login = async (email, password) => {
  const user = await userModel.findByEmail(email);
  if (!user) {
    throw { statusCode: 401, message: 'Email atau password salah' };
  }

  const isMatch = await comparePassword(password, user.password_hash);
  if (!isMatch) {
    throw { statusCode: 401, message: 'Email atau password salah' };
  }

  const token = generateToken(user);
  return { token, user: { id: user.id, name: user.name, email: user.email, position: user.position, avatar: user.avatar } };
};

exports.getMe = async (userId) => {
  const user = await userModel.findById(userId);
  if (!user) {
    throw { statusCode: 404, message: 'User tidak ditemukan' };
  }
  return { id: user.id, name: user.name, email: user.email, position: user.position, avatar: user.avatar };
};
