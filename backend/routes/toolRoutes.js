const express = require('express');
const router = express.Router();
const toolController = require('../controllers/toolController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/categories', protect, toolController.getCategories);
router.get('/next-id', protect, toolController.getNextId);
router.get('/', protect, toolController.getAllTools);
router.get('/:id', protect, toolController.getToolById);
router.get('/:id/history', protect, toolController.getToolHistory);
router.post('/', protect, toolController.createTool);
router.put('/:id', protect, toolController.updateTool);
router.delete('/:id', protect, toolController.deleteTool);
router.post('/:id/photo', protect, upload.single('photo'), toolController.uploadPhoto);

module.exports = router;
