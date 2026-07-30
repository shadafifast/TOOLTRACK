const jwt = require('jsonwebtoken');
const { errorResponse } = require('../helpers/response');

exports.protect = (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return errorResponse(res, 'Tidak ada token, otorisasi ditolak', 401);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.user = decoded;
    next();
  } catch (error) {
    return errorResponse(res, 'Token tidak valid', 401);
  }
};

exports.authorizeAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return errorResponse(res, 'Akses ditolak. Hanya admin yang diizinkan.', 403);
  }
};
