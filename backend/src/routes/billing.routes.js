const { Router } = require('express');
const billingController = require('../controllers/billing.controller');

const router = Router();

router.get('/', billingController.getAll);
router.post('/', billingController.create);
router.get('/:id', billingController.getById);

module.exports = router;
