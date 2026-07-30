const express = require('express');
const router = express.Router();
const borrowController = require('../controllers/borrowController');
const { protect } = require('../middleware/auth');

router.get('/', protect, borrowController.getAllBorrows);
router.get('/export', protect, borrowController.exportBorrows);
router.post('/', protect, borrowController.createBorrow);
router.post('/quick', borrowController.quickBorrow); 
router.patch('/:id/return', borrowController.returnBorrow);

module.exports = router;
