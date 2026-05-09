const { Router } = require('express');
const reportController = require('../controllers/report.controller');

const router = Router();

router.get('/daily-sales', reportController.dailySales);
router.get('/product-sales', reportController.productSales);
router.get('/revenue', reportController.revenue);
router.get('/cash-summary', reportController.cashSummary);

module.exports = router;
