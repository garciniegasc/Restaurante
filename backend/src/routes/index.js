const { Router } = require('express');
const authRoutes = require('./auth.routes');
const menuRoutes = require('./menu.routes');
const orderRoutes = require('./order.routes');
const reservationRoutes = require('./reservation.routes');
const billingRoutes = require('./billing.routes');
const reportRoutes = require('./report.routes');

const router = Router();

router.use('/auth', authRoutes);
router.use('/menu', menuRoutes);
router.use('/orders', orderRoutes);
router.use('/reservations', reservationRoutes);
router.use('/billing', billingRoutes);
router.use('/reports', reportRoutes);

module.exports = router;
