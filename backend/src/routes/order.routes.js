const { Router } = require('express');
const orderController = require('../controllers/order.controller');

const router = Router();

router.get('/', orderController.getAll);
router.get('/:id', orderController.getById);
router.post('/', orderController.create);
router.patch('/:id/status', orderController.updateStatus);

module.exports = router;
