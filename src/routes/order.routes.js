const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRoles } = require('../middlewares/auth.middleware');
const orderController = require('../controllers/order.controller');

// Usuário autenticado
router.post('/create', authenticateToken, orderController.createOrderFromCart);
router.get('/my', authenticateToken, orderController.getMyOrders);
router.get('/:id', authenticateToken, orderController.getOrderById);

// Admin
router.get('/', authenticateToken, authorizeRoles('ADMIN'), orderController.getAllOrders);
router.put('/:id/status', authenticateToken, authorizeRoles('ADMIN'), orderController.updateOrderStatus);

module.exports = router;
