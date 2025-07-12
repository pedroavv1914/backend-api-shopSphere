const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Cria uma sessão de pagamento Stripe para um pedido
exports.createStripeSession = async (req, res) => {
  const { orderId } = req.params;
  try {
    const order = await prisma.order.findUnique({
      where: { id: Number(orderId) },
      include: { items: { include: { product: true } } }
    });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.userId !== req.user.userId) return res.status(403).json({ message: 'Forbidden' });
    if (order.status !== 'PENDING') return res.status(400).json({ message: 'Order already paid or canceled' });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: order.items.map(item => ({
        price_data: {
          currency: 'brl',
          product_data: { name: item.product.name },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      })),
      customer_email: req.user.email,
      success_url: `${process.env.FRONTEND_URL}/orders/${order.id}?payment=success`,
      cancel_url: `${process.env.FRONTEND_URL}/orders/${order.id}?payment=cancel`,
      metadata: { orderId: order.id }
    });
    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ message: 'Error creating payment session', error: err.message });
  }
};

// Webhook Stripe para atualizar status do pedido
const { sendOrderConfirmation } = require('../utils/email');
exports.stripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const orderId = session.metadata.orderId;
    // Atualiza status para PAID
    const order = await prisma.order.update({
      where: { id: Number(orderId) },
      data: { status: 'PAID' },
      include: { items: { include: { product: true } }, user: true }
    });
    // Envia e-mail de confirmação
    try {
      await sendOrderConfirmation(order.user.email, order);
    } catch (emailErr) {
      console.error('Erro ao enviar e-mail de confirmação:', emailErr.message);
    }
  }
  res.json({ received: true });
};
