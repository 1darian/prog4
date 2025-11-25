const bruteForceCaptcha = (req, res, next) => {
  const ip = req.ip || '::1';

  const attempts = req.app.locals.attemptsMap || new Map();
  const data = attempts.get(ip);

  if (data && data.fails >= 3) {
    return res.status(400).json({
      error: 'captcha requerido'
    });
  }

  next();
};

module.exports = bruteForceCaptcha;