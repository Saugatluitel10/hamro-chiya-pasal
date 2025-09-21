const jwt = require('jsonwebtoken')

module.exports = function jwtAuth(req, res, next) {
  try {
    const hdr = req.headers.authorization || ''
    const m = hdr.match(/^Bearer\s+(.+)$/i)
    if (!m) return res.status(401).json({ message: 'Missing token' })
    const token = m[1]
    const secret = process.env.JWT_SECRET || 'dev_secret'
    const payload = jwt.verify(token, secret)
    req.user = payload
    return next()
  } catch (e) {
    return res.status(401).json({ message: 'Invalid token' })
  }
}
