const prisma = require('../config/database');

const movementController = {
  async getAll(req, res, next) {
    try {
      const { page = 1, limit = 20, productId, type, startDate, endDate } = req.query;
      
      const skip = (parseInt(page) - 1) * parseInt(limit);
      const take = parseInt(limit);

      const where = {};

      if (productId) {
        where.productId = productId;
      }

      if (type) {
        where.type = type;
      }

      if (startDate || endDate) {
        where.createdAt = {};
        if (startDate) where.createdAt.gte = new Date(startDate);
        if (endDate) where.createdAt.lte = new Date(endDate);
      }

      const [movements, total] = await Promise.all([
        prisma.movement.findMany({
          where,
          skip,
          take,
          include: {
            product: {
              select: {
                id: true,
                code: true,
                name: true,
                unit: true,
              },
            },
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        }),
        prisma.movement.count({ where }),
      ]);

      res.json({
        movements,
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

  async create(req, res, next) {
    try {
      const { productId, type, quantity, unitPrice, observation } = req.body;

      // Buscar produto
      const product = await prisma.product.findUnique({ where: { id: productId } });
      if (!product) {
        return res.status(404).json({ error: 'Produto não encontrado' });
      }

      // Calcular novo estoque
      let newStock = product.currentStock;
      if (type === 'IN' || type === 'RETURN') {
        newStock += quantity;
      } else if (type === 'OUT' || type === 'LOSS' || type === 'TRANSFER') {
        newStock -= quantity;
        if (newStock < 0) {
          return res.status(400).json({ error: 'Estoque insuficiente' });
        }
      } else if (type === 'ADJUSTMENT') {
        newStock = quantity;
      }

      // Calcular preço total
      const totalPrice = unitPrice ? unitPrice * quantity : null;

      // Criar movimentação e atualizar estoque em transação
      const [movement] = await prisma.$transaction([
        prisma.movement.create({
          data: {
            productId,
            type,
            quantity,
            unitPrice,
            totalPrice,
            observation,
            userId: req.userId,
          },
          include: {
            product: true,
            user: {
              select: { id: true, name: true },
            },
          },
        }),
        prisma.product.update({
          where: { id: productId },
          data: { currentStock: newStock },
        }),
      ]);

      res.status(201).json(movement);
    } catch (error) {
      next(error);
    }
  },

  async getStats(req, res, next) {
    try {
      const { startDate, endDate } = req.query;

      const where = {};
      if (startDate || endDate) {
        where.createdAt = {};
        if (startDate) where.createdAt.gte = new Date(startDate);
        if (endDate) where.createdAt.lte = new Date(endDate);
      }

      const [totalIn, totalOut, totalByType] = await Promise.all([
        prisma.movement.aggregate({
          where: { ...where, type: { in: ['IN', 'RETURN'] } },
          _sum: { quantity: true },
        }),
        prisma.movement.aggregate({
          where: { ...where, type: { in: ['OUT', 'LOSS', 'TRANSFER'] } },
          _sum: { quantity: true },
        }),
        prisma.movement.groupBy({
          by: ['type'],
          where,
          _sum: { quantity: true },
          _count: true,
        }),
      ]);

      res.json({
        totalIn: totalIn._sum.quantity || 0,
        totalOut: totalOut._sum.quantity || 0,
        byType: totalByType,
      });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = movementController;
