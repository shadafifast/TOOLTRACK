const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const { protect } = require('../middleware/auth');

router.get('/departments', employeeController.getDepartments);
router.get('/', employeeController.getAllEmployees);
router.get('/:id', protect, employeeController.getEmployeeById);

module.exports = router;
