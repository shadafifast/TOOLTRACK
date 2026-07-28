const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { protect } = require('../middleware/auth');

router.get('/stats', protect, dashboardController.getStats);
router.get('/chart/weekly', protect, dashboardController.getWeeklyChart);
router.get('/status-distribution', protect, dashboardController.getStatusDistribution);
// Frontend activities path in frontend might be /api/activities instead of /api/dashboard/activities. 
// Based on previous analysis: /api/activities?limit=8
router.get('/activities', protect, dashboardController.getActivities);

module.exports = router;
