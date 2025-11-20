const express = require('express');
const router = express.Router();
const vulnerabilityController = require('../controllers/vulnerabilityController');
const { uploadMiddleware, uploadFile } = require('../controllers/uploadController');
const csrfProtection = require('../middleware/csrfProtection');
const originCheck = require('../middleware/originCheck');

// Command Injection
router.post('/ping', csrfProtection, vulnerabilityController.ping);

// CSRF - Transferencia
router.post('/transfer', originCheck, csrfProtection, vulnerabilityController.transfer);

// Local File Inclusion
router.get('/file', vulnerabilityController.readFile);

// File Upload
router.post('/upload', uploadMiddleware, uploadFile);

module.exports = router;
