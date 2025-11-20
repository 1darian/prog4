const attempts = require('./attemptsStore');

const bruteForceDelay = (req, res, next) => {
  const ip = req.ip;

  if (!attempts.has(ip)) {
    attempts.set(ip, { fails: 0 });
  }

  const data = attempts.get(ip);
  data.fails++;

  // Delay despues del 2do intento
  if (data.fails > 2) {
    return setTimeout(() => next(), 2000);
  }

  next();
};

module.exports = bruteForceDelay;