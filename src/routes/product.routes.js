const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRoles } = require('../middlewares/auth.middleware');
const productController = require('../controllers/product.controller');
const upload = require('../middlewares/upload.middleware');

// Admin only
router.post('/', authenticateToken, authorizeRoles('ADMIN'), upload.single('image'), productController.createProduct);
router.put('/:id', authenticateToken, authorizeRoles('ADMIN'), upload.single('image'), productController.updateProduct);
router.delete('/:id', authenticateToken, authorizeRoles('ADMIN'), productController.deleteProduct);

// Public
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);

module.exports = router;
