const prisma = require('../config/database');

const productController = {
  async getAll(req, res, next) {
    try {
      const { page = 1, limit = 10, search, categoryId, status, lowStock } = req.query;
      
      const skip = (parseInt(page) - 1) * parseInt(limit);
      const take = parseInt(limit);

      const where = {};
      
      if (search) {
        where.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { code: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ];
      }

      if (categoryId) {
        where.categoryId = categoryId;
      }

      if (status) {
        where.status = status;
      }

      if (lowStock === 'true') {
        where.currentStock = { lte: prisma.raw('min_stock') };
      }

      const [products, total] = await Promise.all([
        prisma.product.findMany({
          where,
          skip,
          take,
          include: {
            category: true,
            supplier: true,
          },
          orderBy: { name: 'asc' },
        }),
        prisma.product.count({ where }),
      ]);

      res.json({
        products,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / take),
        },
      });
    } catch (error) {
      next(error);
    }
  },

  async getById(req, res, next) {
    try {
      const { id } = req.params;

      const product = await prisma.product.findUnique({
        where: { id },
        include: {
          category: true,
          supplier: true,
          movements: {
            take: 10,
            orderBy: { createdAt: 'desc' },
            include: {
              user: {
                select: { id: true, name: true },
              },
            },
          },
        },
      });

      if (!product) {
        return res.status(404).json({ error: 'Produto não encontrado' });
      }

      res.json(product);
    } catch (error) {
      next(error);
    }
  },

  async create(req, res, next) {
    try {
      const data = req.body;

      const product = await prisma.product.create({
        data,
        include: {
          category: true,
          supplier: true,
        },
      });

      res.status(201).json(product);
    } catch (error) {
      next(error);
    }
  },

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const data = req.body;

      const product = await prisma.product.update({
        where: { id },
        data,
        include: {
          category: true,
          supplier: true,
        },
      });

      res.json(product);
    } catch (error) {
      next(error);
    }
  },

  async delete(req, res, next) {
    try {
      const { id } = req.params;

      await prisma.product.delete({ where: { id } });

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },

  async getLowStock(req, res, next) {
    try {
      const products = await prisma.$queryRaw`
        SELECT * FROM products 
        WHERE current_stock <= min_stock 
        AND status = 'ACTIVE'
        ORDER BY (min_stock - current_stock) DESC
      `;

      res.json(products);
    } catch (error) {
      next(error);
    }
  },

  async getStats(req, res, next) {
    try {
      const [total, active, lowStock, outOfStock] = await Promise.all([
        prisma.product.count(),
        prisma.product.count({ where: { status: 'ACTIVE' } }),
        prisma.$queryRaw`SELECT COUNT(*) as count FROM products WHERE current_stock <= min_stock AND status = 'ACTIVE'`,
        prisma.product.count({ where: { currentStock: 0, status: 'ACTIVE' } }),
      ]);

      res.json({
        total,
        active,
        lowStock: parseInt(lowStock[0].count),
        outOfStock,
      });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = productController;
