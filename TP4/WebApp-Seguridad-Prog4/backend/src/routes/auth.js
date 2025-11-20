const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const bruteForceDelay = require('../middleware/bruteForceDelay');
const bruteForceCaptcha = require('../middleware/bruteForceCaptcha');
const bruteForceRateLimitLogin = require('../middleware/bruteForceRateLimitLogin');

router.post('/login',
  bruteForceRateLimitLogin,
  bruteForceDelay,
  bruteForceCaptcha,
  authController.login
);
router.post('/register', authController.register);
router.post('/auth/verify', authController.verifyToken);
router.post('/check-username', authController.checkUsername);

module.exports = router;
