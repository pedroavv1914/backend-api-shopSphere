const { PrismaClient, OrderStatus } = require('@prisma/client');
const prisma = new PrismaClient();

// Cria pedido a partir do carrinho do usuário
exports.createOrderFromCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: { product: true }
    });
    if (!cartItems.length) {
      return res.status(400).json({ message: 'Cart is empty' });
    }
    const total = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const order = await prisma.order.create({
      data: {
        userId,
        total,
        items: {
          create: cartItems.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price
          }))
        }
      },
      include: { items: true }
    });
    // Limpa o carrinho após criar o pedido
    await prisma.cartItem.deleteMany({ where: { userId } });
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: 'Error creating order', error: err.message });
  }
};

// Lista pedidos do usuário autenticado
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.userId },
      include: { items: { include: { product: true } } }
    });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching orders', error: err.message });
  }
};

// Lista todos os pedidos (admin)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: { user: true, items: { include: { product: true } } }
    });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching all orders', error: err.message });
  }
};

// Detalha um pedido
exports.getOrderById = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await prisma.order.findUnique({
      where: { id: Number(id) },
      include: { items: { include: { product: true } }, user: true }
    });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    // Só permite o próprio usuário ou admin ver
    if (order.userId !== req.user.userId && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Forbidden' });
    }
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching order', error: err.message });
  }
};

// Atualiza status do pedido (admin)
exports.updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  if (!Object.values(OrderStatus).includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }
  try {
    const order = await prisma.order.update({
      where: { id: Number(id) },
      data: { status }
    });
    res.json(order);
  } catch (err) {
    res.status(400).json({ message: 'Error updating order status', error: err.message });
  }
};
