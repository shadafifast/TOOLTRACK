const employeeModel = require('../models/employeeModel');
const { successResponse } = require('../helpers/response');

exports.getAllEmployees = async (req, res, next) => {
  try {
    const { search, department } = req.query;
    const result = await employeeModel.findAll(search, department);
    return successResponse(res, result, 'Data karyawan berhasil diambil');
  } catch (error) {
    next(error);
  }
};

exports.getEmployeeById = async (req, res, next) => {
  try {
    const result = await employeeModel.findById(req.params.id);
    if (!result) return res.status(404).json({ success: false, message: 'Karyawan tidak ditemukan' });
    return successResponse(res, result, 'Detail karyawan berhasil diambil');
  } catch (error) {
    next(error);
  }
};

exports.getDepartments = async (req, res, next) => {
  try {
    const departments = await employeeModel.getDepartments();
    const formatted = departments.map(d => ({ id: d.id, name: d.name }));
    return successResponse(res, formatted, 'Departemen berhasil diambil');
  } catch (error) {
    next(error);
  }
};
