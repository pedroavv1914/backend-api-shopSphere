const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middlewares/auth.middleware');
const paymentController = require('../controllers/payment.controller');

// Inicia pagamento Stripe para um pedido
router.post('/create-session/:orderId', authenticateToken, paymentController.createStripeSession);

// Webhook Stripe (não autenticado)
router.post('/stripe/webhook', express.raw({type: 'application/json'}), paymentController.stripeWebhook);

module.exports = router;
