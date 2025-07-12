require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();
const path = require('path');

app.use(cors());
app.use(express.json());

// Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Auth routes
const authRoutes = require('./routes/auth.routes');
app.use('/api/auth', authRoutes);

// Category routes
const categoryRoutes = require('./routes/category.routes');
app.use('/api/categories', categoryRoutes);

// Product routes
const productRoutes = require('./routes/product.routes');
app.use('/api/products', productRoutes);

// Cart routes
const cartRoutes = require('./routes/cart.routes');
app.use('/api/cart', cartRoutes);

// Order routes
const orderRoutes = require('./routes/order.routes');
app.use('/api/orders', orderRoutes);

// Payment routes (Stripe webhook needs raw body)
const paymentRoutes = require('./routes/payment.routes');
app.use('/api/payments', paymentRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
