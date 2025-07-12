const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getCart = async (req, res) => {
  try {
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: req.user.userId },
      include: { product: true }
    });
    res.json(cartItems);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching cart', error: err.message });
  }
};

exports.addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  try {
    // Se já existe, soma a quantidade
    const existing = await prisma.cartItem.findFirst({
      where: { userId: req.user.userId, productId: Number(productId) }
    });
    if (existing) {
      const updated = await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + Number(quantity) }
      });
      return res.json(updated);
    }
    const cartItem = await prisma.cartItem.create({
      data: {
        userId: req.user.userId,
        productId: Number(productId),
        quantity: Number(quantity)
      }
    });
    res.status(201).json(cartItem);
  } catch (err) {
    res.status(400).json({ message: 'Error adding to cart', error: err.message });
  }
};

exports.updateCartItem = async (req, res) => {
  const { itemId } = req.params;
  const { quantity } = req.body;
  try {
    const cartItem = await prisma.cartItem.update({
      where: { id: Number(itemId), userId: req.user.userId },
      data: { quantity: Number(quantity) }
    });
    res.json(cartItem);
  } catch (err) {
    res.status(400).json({ message: 'Error updating cart item', error: err.message });
  }
};

exports.removeCartItem = async (req, res) => {
  const { itemId } = req.params;
  try {
    await prisma.cartItem.delete({
      where: { id: Number(itemId), userId: req.user.userId }
    });
    res.json({ message: 'Cart item removed' });
  } catch (err) {
    res.status(400).json({ message: 'Error removing cart item', error: err.message });
  }
};
