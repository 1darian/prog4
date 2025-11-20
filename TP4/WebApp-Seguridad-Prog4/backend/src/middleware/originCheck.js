const originCheck = (req, res, next) => {
  const allowedOrigins = ['http://localhost:3000']; // Ajustar por frontend
  const origin = req.get('origin');
  const referer = req.get('referer');

  if (origin && !allowedOrigins.includes(origin)) {
    return res.status(403).json({ error: 'Invalid Origin' });
  }

  if (!origin && referer) {
    const refererUrl = new URL(referer);
    if (!allowedOrigins.includes(refererUrl.origin)) {
      return res.status(403).json({ error: 'Invalid Referer' });
    }
  }

  next();
};

module.exports = originCheck;
