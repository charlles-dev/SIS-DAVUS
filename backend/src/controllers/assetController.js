const prisma = require('../config/database');

const assetController = {
  async getAll(req, res, next) {
    try {
      const { page = 1, limit = 10, search, status, location } = req.query;
      
      const skip = (parseInt(page) - 1) * parseInt(limit);
      const take = parseInt(limit);

      const where = {};

      if (search) {
        where.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { code: { contains: search, mode: 'insensitive' } },
          { serialNumber: { contains: search, mode: 'insensitive' } },
        ];
      }

      if (status) {
        where.status = status;
      }

      if (location) {
        where.location = { contains: location, mode: 'insensitive' };
      }

      const [assets, total] = await Promise.all([
        prisma.asset.findMany({
          where,
          skip,
          take,
          orderBy: { name: 'asc' },
        }),
        prisma.asset.count({ where }),
      ]);

      res.json({
        assets,
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

      const asset = await prisma.asset.findUnique({
        where: { id },
      });

      if (!asset) {
        return res.status(404).json({ error: 'Patrimônio não encontrado' });
      }

      res.json(asset);
    } catch (error) {
      next(error);
    }
  },

  async create(req, res, next) {
    try {
      const data = req.body;

      const asset = await prisma.asset.create({
        data,
      });

      res.status(201).json(asset);
    } catch (error) {
      next(error);
    }
  },

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const data = req.body;

      const asset = await prisma.asset.update({
        where: { id },
        data,
      });

      res.json(asset);
    } catch (error) {
      next(error);
    }
  },

  async delete(req, res, next) {
    try {
      const { id } = req.params;

      await prisma.asset.delete({ where: { id } });

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },

  async getStats(req, res, next) {
    try {
      const [total, byStatus, totalValue, maintenanceDue] = await Promise.all([
        prisma.asset.count(),
        prisma.asset.groupBy({
          by: ['status'],
          _count: true,
        }),
        prisma.asset.aggregate({
          _sum: { currentValue: true },
        }),
        prisma.asset.count({
          where: {
            maintenanceDate: {
              lte: new Date(),
            },
            status: 'ACTIVE',
          },
        }),
      ]);

      res.json({
        total,
        byStatus,
        totalValue: totalValue._sum.currentValue || 0,
        maintenanceDue,
      });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = assetController;
