const prisma = require('../config/database');

const categoryController = {
  async getAll(req, res, next) {
    try {
      const categories = await prisma.category.findMany({
        include: {
          _count: {
            select: { products: true },
          },
        },
        orderBy: { name: 'asc' },
      });

      res.json(categories);
    } catch (error) {
      next(error);
    }
  },

  async getById(req, res, next) {
    try {
      const { id } = req.params;

      const category = await prisma.category.findUnique({
        where: { id },
        include: {
          products: true,
          _count: {
            select: { products: true },
          },
        },
      });

      if (!category) {
        return res.status(404).json({ error: 'Categoria não encontrada' });
      }

      res.json(category);
    } catch (error) {
      next(error);
    }
  },

  async create(req, res, next) {
    try {
      const { name, description } = req.body;

      const category = await prisma.category.create({
        data: { name, description },
      });

      res.status(201).json(category);
    } catch (error) {
      next(error);
    }
  },

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const { name, description } = req.body;

      const category = await prisma.category.update({
        where: { id },
        data: { name, description },
      });

      res.json(category);
    } catch (error) {
      next(error);
    }
  },

  async delete(req, res, next) {
    try {
      const { id } = req.params;

      await prisma.category.delete({ where: { id } });

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
};

module.exports = categoryController;
