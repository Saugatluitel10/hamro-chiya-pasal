// Simple admin guard using a shared key header.
// Require process.env.ADMIN_KEY and expect clients to send header: x-admin-key: <key>

module.exports = function adminGuard(req, res, next) {
  const required = process.env.ADMIN_KEY
  if (!required) {
    res.status(503)
    return res.json({ ok: false, message: 'ADMIN_KEY not configured' })
  }
  const provided = req.header('x-admin-key') || req.header('X-Admin-Key')
  if (!provided || provided !== required) {
    res.status(401)
    return res.json({ ok: false, message: 'Unauthorized' })
  }
  return next()
}
