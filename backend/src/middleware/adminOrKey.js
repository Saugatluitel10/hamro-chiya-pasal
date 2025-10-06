const jwt = require('jsonwebtoken')

module.exports = function adminOrKey(req, res, next) {
  // x-admin-key short-circuit
  const headerKey = req.headers['x-admin-key']
  if (headerKey && process.env.ADMIN_KEY && String(headerKey) === String(process.env.ADMIN_KEY)) return next()

  // JWT with allowed admin email
  try {
    const hdr = req.headers.authorization || ''
    const m = hdr.match(/^Bearer\s+(.+)$/i)
    if (!m) return res.status(401).json({ message: 'Unauthorized' })
    const token = m[1]
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret')
    const email = String(payload?.email || '')
    const allowed = (process.env.ALLOWED_ADMIN_EMAILS || '')
      .split(',')
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean)
    if (!email || !allowed.includes(email.toLowerCase())) {
      return res.status(401).json({ message: 'Unauthorized' })
    }
    req.user = Object.assign({}, req.user, payload)
    return next()
  } catch {
    return res.status(401).json({ message: 'Unauthorized' })
  }
}
