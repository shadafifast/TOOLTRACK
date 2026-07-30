const express = require('express');
const router = express.Router();
const toolController = require('../controllers/toolController');
const { protect, authorizeAdmin } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/categories', protect, toolController.getCategories);
router.get('/next-id', protect, toolController.getNextId);
router.get('/', protect, toolController.getAllTools);
router.get('/:id', protect, toolController.getToolById);
router.get('/:id/history', protect, toolController.getToolHistory);
router.post('/', protect, authorizeAdmin, toolController.createTool);
router.put('/:id', protect, authorizeAdmin, toolController.updateTool);
router.delete('/:id', protect, authorizeAdmin, toolController.deleteTool);
router.post('/:id/photo', protect, authorizeAdmin, upload.single('photo'), toolController.uploadPhoto);

module.exports = router;
