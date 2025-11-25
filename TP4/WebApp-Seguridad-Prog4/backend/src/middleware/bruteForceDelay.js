const bruteForceDelay = (req, res, next) => {
  const ip = req.ip || '::1';

  if (!req.app.locals.attemptsMap) {
    req.app.locals.attemptsMap = new Map();
  }

  const attempts = req.app.locals.attemptsMap;

  if (!attempts.has(ip)) {
    attempts.set(ip, { fails: 0 });
  }

  const data = attempts.get(ip);
  data.fails++;

  if (data.fails > 1) {
    const delay = 600;
    return setTimeout(() => next(), delay);
  }

  next();
};

module.exports = bruteForceDelay;