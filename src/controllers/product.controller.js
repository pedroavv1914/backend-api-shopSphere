const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.createProduct = async (req, res) => {
  const { name, description, price, categoryId } = req.body;
  let imageUrl = null;
  if (req.file) {
    imageUrl = `/uploads/${req.file.filename}`;
  }
  try {
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        imageUrl,
        categoryId: Number(categoryId)
      }
    });
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ message: 'Error creating product', error: err.message });
  }
};

exports.updateProduct = async (req, res) => {
    const { id } = req.params;
    const { name, description, price, categoryId } = req.body;
    let imageUrl = undefined;
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }
    try {
      const data = {
        name,
        description,
        price: parseFloat(price),
        categoryId: Number(categoryId)
      };
      if (imageUrl) data.imageUrl = imageUrl;
      const product = await prisma.product.update({
        where: { id: Number(id) },
        data
      });
      res.json(product);
    } catch (err) {
      res.status(400).json({ message: 'Error updating product', error: err.message });
    }
  };
  
  exports.deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
      await prisma.product.delete({ where: { id: Number(id) } });
      res.json({ message: 'Product deleted' });
    } catch (err) {
      res.status(400).json({ message: 'Error deleting product', error: err.message });
    }
  };
  
  exports.getAllProducts = async (req, res) => {
    try {
      const products = await prisma.product.findMany({ include: { category: true } });
      res.json(products);
    } catch (err) {
      res.status(500).json({ message: 'Error fetching products', error: err.message });
    }
  };
  
  exports.getProductById = async (req, res) => {
    const { id } = req.params;
    try {
      const product = await prisma.product.findUnique({ where: { id: Number(id) }, include: { category: true } });
      if (!product) return res.status(404).json({ message: 'Product not found' });
      res.json(product);
    } catch (err) {
      res.status(500).json({ message: 'Error fetching product', error: err.message });
    }
  };