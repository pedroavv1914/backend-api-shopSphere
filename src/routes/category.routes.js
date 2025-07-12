const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRoles } = require('../middlewares/auth.middleware');
const categoryController = require('../controllers/category.controller');

// Admin only
router.post('/', authenticateToken, authorizeRoles('ADMIN'), categoryController.createCategory);
router.put('/:id', authenticateToken, authorizeRoles('ADMIN'), categoryController.updateCategory);
router.delete('/:id', authenticateToken, authorizeRoles('ADMIN'), categoryController.deleteCategory);

// Public
router.get('/', categoryController.getAllCategories);
router.get('/:id', categoryController.getCategoryById);

module.exports = router;
