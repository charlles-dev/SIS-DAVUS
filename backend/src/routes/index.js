const express = require('express');
const authRoutes = require('./authRoutes');
const productRoutes = require('./productRoutes');
const movementRoutes = require('./movementRoutes');
const categoryRoutes = require('./categoryRoutes');
const assetRoutes = require('./assetRoutes');
const dashboardRoutes = require('./dashboardRoutes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/movements', movementRoutes);
router.use('/categories', categoryRoutes);
router.use('/assets', assetRoutes);
router.use('/dashboard', dashboardRoutes);

router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

module.exports = router;
