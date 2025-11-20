const rateLimit = require('express-rate-limit');

const bruteForceRateLimitLogin = rateLimit({
  windowsMs: 10 * 60 * 1000, // 15 minutos
  max: 5, // 5 intentos por cada ip
  message: 'Demasiados intentos fallidos. Intente de nuevo en 15 minutos.',
  statusCode: 429, // 429 Too Many Requests
  headers: true, // Agrega los headers de rate limit
})

module.exports = bruteForceRateLimitLogin;