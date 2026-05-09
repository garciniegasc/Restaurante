const { Router } = require('express');
const authController = require('../controllers/auth.controller');

const router = Router();

router.post('/login', authController.login);
router.get('/me', authController.me);

module.exports = router;
