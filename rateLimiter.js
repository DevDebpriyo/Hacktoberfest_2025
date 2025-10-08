// rateLimiter.js
const rateLimiters = new Map();

function rateLimiter(req, res, next) {
  const ip = req.ip || req.connection.remoteAddress;
  const now = Date.now();
  const windowTime = 60000; // 1 min
  const maxRequests = 10;

  if (!rateLimiters.has(ip)) rateLimiters.set(ip, []);
  const timestamps = rateLimiters.get(ip).filter(ts => now - ts < windowTime);
  timestamps.push(now);
  rateLimiters.set(ip, timestamps);

  if (timestamps.length > maxRequests) {
    return res.status(429).json({ message: 'Too many requests. Try again later.' });
  }

  next();
}

module.exports = rateLimiter;
