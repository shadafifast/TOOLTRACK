const toolModel = require('../models/toolModel');

exports.getAllTools = async (query) => {
  const filters = {
    search: query.search || '',
    status: query.status || '',
    category: query.category || ''
  };
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 10;
  return toolModel.findAll(filters, page, limit);
};

exports.getToolById = async (id) => {
  // Update last scan time to current local time
  await toolModel.update(id, { last_scan_time: new Date() });
  
  const tool = await toolModel.findById(id);
  if (!tool) throw { statusCode: 404, message: 'Alat tidak ditemukan' };
  return tool;
};

exports.createTool = async (data) => {
  const nextId = await toolModel.generateNextId();

  // Resolve category string → ID
  let category_id = await toolModel.getCategoryIdByName(data.category);
  if (!category_id) category_id = 1; // fallback

  const newTool = {
    id: nextId,
    name: data.name,
    category_id,
    location: data.location,
    serialNumber: data.serialNumber,
    description: data.description || null,
    purchaseDate: data.purchaseDate || null
  };

  await toolModel.create(newTool);
  return exports.getToolById(nextId);
};

exports.updateTool = async (id, data) => {
  await exports.getToolById(id); // pastikan alat ada

  const updateData = {};

  if (data.name         !== undefined) updateData.name          = data.name;
  if (data.location     !== undefined) updateData.location      = data.location;
  if (data.serialNumber !== undefined) updateData.serial_number = data.serialNumber;
  if (data.description  !== undefined) updateData.description   = data.description;
  if (data.status       !== undefined) updateData.status        = data.status;
  if (data.photoUrl     !== undefined) updateData.photo_url     = data.photoUrl;
  if (data.purchaseDate !== undefined) updateData.purchase_date = data.purchaseDate || null;

  // Resolve category string → ID
  if (data.category !== undefined) {
    const cat_id = await toolModel.getCategoryIdByName(data.category);
    if (cat_id) updateData.category_id = cat_id;
  }

  if (Object.keys(updateData).length > 0) {
    await toolModel.update(id, updateData);
  }

  return exports.getToolById(id);
};

exports.deleteTool = async (id) => {
  await exports.getToolById(id);
  await toolModel.delete(id);
  return { success: true };
};

exports.getCategories = async () => {
  const categories = await toolModel.getCategories();
  return categories.map(c => c.name);
};

exports.getToolHistory = async (id) => {
  return toolModel.getHistory(id);
};

exports.getNextId = async () => {
  const nextId = await toolModel.generateNextId();
  return { nextId };
};
