const dashboardModel = require('../models/dashboardModel');
const { successResponse } = require('../helpers/response');

exports.getStats = async (req, res, next) => {
  try {
    const stats = await dashboardModel.getStats();
    return successResponse(res, stats, 'Statistik berhasil diambil');
  } catch (error) {
    next(error);
  }
};

exports.getWeeklyChart = async (req, res, next) => {
  try {
    const data = await dashboardModel.getWeeklyChart();
    
    const days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
    const formatted = data.map(row => {
      const d = new Date(row.date);
      return {
        hari: days[d.getDay()],
        peminjaman: Number(row.borrows),
        pengembalian: Number(row.returns)
      };
    });

    return successResponse(res, formatted, 'Data grafik berhasil diambil');
  } catch (error) {
    next(error);
  }
};

exports.getStatusDistribution = async (req, res, next) => {
  try {
    const data = await dashboardModel.getStatusDistribution();
    const colors = {
      available: '#10b981',
      borrowed: '#3b82f6',
      overdue: '#ef4444',
      damaged: '#f59e0b'
    };
    
    const formatted = data.map(row => ({
      name: row.name === 'available' ? 'Tersedia' :
            row.name === 'borrowed' ? 'Dipinjam' :
            row.name === 'overdue' ? 'Terlambat' : 'Rusak',
      value: Number(row.value),
      color: colors[row.name] || '#64748b'
    }));

    return successResponse(res, formatted, 'Distribusi status berhasil diambil');
  } catch (error) {
    next(error);
  }
};

exports.getActivities = async (req, res, next) => {
  try {
    const limit = req.query.limit || 8;
    const activities = await dashboardModel.getActivities(limit);
    return successResponse(res, activities, 'Aktivitas terbaru berhasil diambil');
  } catch (error) {
    next(error);
  }
};
