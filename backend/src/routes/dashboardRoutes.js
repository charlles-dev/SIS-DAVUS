const express = require('express');
const prisma = require('../config/database');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

router.get('/overview', async (req, res, next) => {
  try {
    const [
      productsStats,
      assetsStats,
      recentMovements,
      lowStockProducts,
    ] = await Promise.all([
      // Estatísticas de produtos
      Promise.all([
        prisma.product.count(),
        prisma.product.count({ where: { status: 'ACTIVE' } }),
        prisma.$queryRaw`SELECT COUNT(*) as count FROM products WHERE current_stock <= min_stock AND status = 'ACTIVE'`,
        prisma.product.count({ where: { currentStock: 0, status: 'ACTIVE' } }),
      ]).then(([total, active, lowStock, outOfStock]) => ({
        total,
        active,
        lowStock: parseInt(lowStock[0].count),
        outOfStock,
      })),
      
      // Estatísticas de patrimônio
      Promise.all([
        prisma.asset.count(),
        prisma.asset.count({ where: { status: 'ACTIVE' } }),
        prisma.asset.aggregate({ _sum: { currentValue: true } }),
      ]).then(([total, active, totalValue]) => ({
        total,
        active,
        totalValue: totalValue._sum.currentValue || 0,
      })),

      // Movimentações recentes
      prisma.movement.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          product: { select: { name: true, code: true } },
          user: { select: { name: true } },
        },
      }),

      // Produtos com estoque baixo
      prisma.$queryRaw`
        SELECT * FROM products 
        WHERE current_stock <= min_stock 
        AND status = 'ACTIVE'
        ORDER BY (min_stock - current_stock) DESC
        LIMIT 5
      `,
    ]);

    res.json({
      products: productsStats,
      assets: assetsStats,
      recentMovements,
      lowStockProducts,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
