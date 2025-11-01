const express = require('express');
const productController = require('../controllers/productController');
const { authMiddleware, checkRole } = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

router.get('/', productController.getAll);
router.get('/stats', productController.getStats);
router.get('/low-stock', productController.getLowStock);
router.get('/:id', productController.getById);
router.post('/', checkRole('ADMIN', 'MANAGER'), productController.create);
router.put('/:id', checkRole('ADMIN', 'MANAGER'), productController.update);
router.delete('/:id', checkRole('ADMIN'), productController.delete);

module.exports = router;
