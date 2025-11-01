const express = require('express');
const movementController = require('../controllers/movementController');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

router.get('/', movementController.getAll);
router.get('/stats', movementController.getStats);
router.post('/', movementController.create);

module.exports = router;
