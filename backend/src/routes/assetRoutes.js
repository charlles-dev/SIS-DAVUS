const express = require('express');
const assetController = require('../controllers/assetController');
const { authMiddleware, checkRole } = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

router.get('/', assetController.getAll);
router.get('/stats', assetController.getStats);
router.get('/:id', assetController.getById);
router.post('/', checkRole('ADMIN', 'MANAGER'), assetController.create);
router.put('/:id', checkRole('ADMIN', 'MANAGER'), assetController.update);
router.delete('/:id', checkRole('ADMIN'), assetController.delete);

module.exports = router;
