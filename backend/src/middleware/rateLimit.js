// Simple in-memory rate limiter (per-IP)
// For production scale, prefer a shared store (e.g., Redis) or express-rate-limit.

function createRateLimit({ windowMs = 60_000, max = 8 } = {}) {
  const hits = new Map()

  return function rateLimit(req, res, next) {
    const key = req.ip || req.headers['x-forwarded-for'] || 'unknown'
    const now = Date.now()

    const entry = hits.get(key) || { count: 0, resetAt: now + windowMs }

    // Reset window if expired
    if (now > entry.resetAt) {
      entry.count = 0
      entry.resetAt = now + windowMs
    }

    entry.count += 1
    hits.set(key, entry)

    const remaining = Math.max(0, max - entry.count)
    res.setHeader('X-RateLimit-Limit', String(max))
    res.setHeader('X-RateLimit-Remaining', String(remaining))
    res.setHeader('X-RateLimit-Reset', String(Math.ceil(entry.resetAt / 1000)))

    if (entry.count > max) {
      const retryAfterSec = Math.ceil((entry.resetAt - now) / 1000)
      res.setHeader('Retry-After', String(retryAfterSec))
      return res.status(429).json({
        ok: false,
        message: 'Too many requests. Please try again later.'
      })
    }

    next()
  }
}

module.exports = { createRateLimit }
