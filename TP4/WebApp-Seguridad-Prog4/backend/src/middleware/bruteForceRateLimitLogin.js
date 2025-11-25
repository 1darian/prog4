const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Demasiados intentos fallidos. Intente de nuevo en 15 minutos.',
  statusCode: 429,
  headers: true,
  keyGenerator: (req) => {
    if (!req.app.locals.__limiterAppId) {
      req.app.locals.__limiterAppId = `${Date.now()}-${Math.random()}`;
    }
    return `${req.ip || '::1'}:${req.app.locals.__limiterAppId}`;
  }
});

module.exports = limiter;