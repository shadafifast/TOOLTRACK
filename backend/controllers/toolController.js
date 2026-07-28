const toolService = require('../services/toolService');
const { successResponse } = require('../helpers/response');
const { createToolSchema, updateToolSchema } = require('../validation/toolValidation');

exports.getAllTools = async (req, res, next) => {
  try {
    const result = await toolService.getAllTools(req.query);
    return successResponse(res, result, 'Data alat berhasil diambil');
  } catch (error) {
    next(error);
  }
};

exports.getToolById = async (req, res, next) => {
  try {
    const result = await toolService.getToolById(req.params.id);
    return successResponse(res, result, 'Detail alat berhasil diambil');
  } catch (error) {
    next(error);
  }
};

exports.createTool = async (req, res, next) => {
  try {
    const validatedData = createToolSchema.parse(req.body);
    const result = await toolService.createTool(validatedData);
    return successResponse(res, result, 'Alat berhasil ditambahkan', 201);
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ success: false, message: 'Validasi gagal', errors: error.errors });
    }
    next(error);
  }
};

exports.updateTool = async (req, res, next) => {
  try {
    const validatedData = updateToolSchema.parse(req.body);
    const result = await toolService.updateTool(req.params.id, validatedData);
    return successResponse(res, result, 'Alat berhasil diubah');
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ success: false, message: 'Validasi gagal', errors: error.errors });
    }
    next(error);
  }
};

exports.deleteTool = async (req, res, next) => {
  try {
    await toolService.deleteTool(req.params.id);
    return successResponse(res, null, 'Alat berhasil dihapus');
  } catch (error) {
    next(error);
  }
};

exports.getCategories = async (req, res, next) => {
  try {
    const result = await toolService.getCategories();
    return successResponse(res, result, 'Kategori berhasil diambil');
  } catch (error) {
    next(error);
  }
};

exports.getToolHistory = async (req, res, next) => {
  try {
    const result = await toolService.getToolHistory(req.params.id);
    return successResponse(res, result, 'Riwayat alat berhasil diambil');
  } catch (error) {
    next(error);
  }
};

exports.getNextId = async (req, res, next) => {
  try {
    const result = await toolService.getNextId();
    return successResponse(res, result, 'ID berikutnya berhasil diambil');
  } catch (error) {
    next(error);
  }
};

exports.uploadPhoto = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Tidak ada file yang diunggah' });
    }
    
    const photoUrl = `/uploads/${req.file.filename}`;
    await toolService.updateTool(req.params.id, { photoUrl });
    
    return successResponse(res, { photoUrl }, 'Foto berhasil diunggah');
  } catch (error) {
    next(error);
  }
};
