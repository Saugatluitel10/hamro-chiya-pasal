// Minimal security headers without external dependencies
module.exports = function securityHeaders(req, res, next) {
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('X-Frame-Options', 'SAMEORIGIN')
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
  res.setHeader('X-XSS-Protection', '0') // modern browsers ignore or use CSP
  // Opt into safer cross-origin isolation policies when possible
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin')
  res.setHeader('Cross-Origin-Resource-Policy', 'same-site')
  // Minimal Permissions-Policy; extend as needed
  res.setHeader('Permissions-Policy', 'geolocation=(), camera=(), microphone=()')
  next()
}
