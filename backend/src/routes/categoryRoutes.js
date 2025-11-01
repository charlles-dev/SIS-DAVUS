const express = require('express');
const categoryController = require('../controllers/categoryController');
const { authMiddleware, checkRole } = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

router.get('/', categoryController.getAll);
router.get('/:id', categoryController.getById);
router.post('/', checkRole('ADMIN', 'MANAGER'), categoryController.create);
router.put('/:id', checkRole('ADMIN', 'MANAGER'), categoryController.update);
router.delete('/:id', checkRole('ADMIN'), categoryController.delete);

module.exports = router;
