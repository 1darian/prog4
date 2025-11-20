const express = require('express');
const router = express.Router();
const csrfProtection = require('../middleware/csrfProtection');

router.get('/csrf-token', csrfProtection, (req, res) => {
  const token = req.csrfToken();
  console.error('Server CSRF Token:', token);
  console.error('Server Cookies:', req.cookies);
  res.status(200).json({ csrfToken: token });
});

module.exports = router;
