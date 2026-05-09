const { Router } = require('express');
const menuController = require('../controllers/menu.controller');

const router = Router();

router.get('/', menuController.getAll);
router.get('/:id', menuController.getById);
router.post('/', menuController.create);
router.put('/:id', menuController.update);
router.delete('/:id', menuController.remove);
router.patch('/:id/availability', menuController.toggleAvailability);

module.exports = router;
