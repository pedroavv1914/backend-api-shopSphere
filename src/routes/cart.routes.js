const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middlewares/auth.middleware');
const cartController = require('../controllers/cart.controller');

// Todas as rotas protegidas
router.get('/', authenticateToken, cartController.getCart);
router.post('/add', authenticateToken, cartController.addToCart);
router.put('/update/:itemId', authenticateToken, cartController.updateCartItem);
router.delete('/remove/:itemId', authenticateToken, cartController.removeCartItem);

module.exports = router;
