const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.createCategory = async (req, res) => {
  const { name } = req.body;
  try {
    const category = await prisma.category.create({ data: { name } });
    res.status(201).json(category);
  } catch (err) {
    res.status(400).json({ message: 'Error creating category', error: err.message });
  }
};

exports.updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const category = await prisma.category.update({ where: { id: Number(id) }, data: { name } });
    res.json(category);
  } catch (err) {
    res.status(400).json({ message: 'Error updating category', error: err.message });
  }
};

exports.deleteCategory = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.category.delete({ where: { id: Number(id) } });
    res.json({ message: 'Category deleted' });
  } catch (err) {
    res.status(400).json({ message: 'Error deleting category', error: err.message });
  }
};

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching categories', error: err.message });
  }
};

exports.getCategoryById = async (req, res) => {
  const { id } = req.params;
  try {
    const category = await prisma.category.findUnique({ where: { id: Number(id) } });
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching category', error: err.message });
  }
};
