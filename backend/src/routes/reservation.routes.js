const { Router } = require('express');
const reservationController = require('../controllers/reservation.controller');

const router = Router();

router.get('/', reservationController.getAll);
router.post('/', reservationController.create);
router.patch('/:id/status', reservationController.updateStatus);
router.delete('/:id', reservationController.remove);

module.exports = router;
