const authService = require('../services/authService');
const { successResponse } = require('../helpers/response');
const { registerSchema, loginSchema } = require('../validation/authValidation');

exports.register = async (req, res, next) => {
  try {
    const validatedData = registerSchema.parse(req.body);
    const result = await authService.register(validatedData);
    return successResponse(res, result, 'Registrasi berhasil', 201);
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ success: false, message: 'Validasi gagal', errors: error.errors });
    }
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const validatedData = loginSchema.parse(req.body);
    const result = await authService.login(validatedData.email, validatedData.password);
    return successResponse(res, result, 'Login berhasil');
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ success: false, message: 'Validasi gagal', errors: error.errors });
    }
    next(error);
  }
};

exports.logout = async (req, res, next) => {
  try {
    return successResponse(res, null, 'Logout berhasil');
  } catch (error) {
    next(error);
  }
};

exports.getMe = async (req, res, next) => {
  try {
    const result = await authService.getMe(req.user.id);
    return successResponse(res, result, 'Data user berhasil diambil');
  } catch (error) {
    next(error);
  }
};
