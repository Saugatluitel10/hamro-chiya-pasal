const jwt = require('jsonwebtoken')

exports.googleSignIn = async (req, res) => {
  try {
    const { id_token } = req.body || {}
    if (!id_token) {
      return res.status(400).json({ message: 'Missing id_token' })
    }
    const clientId = process.env.GOOGLE_CLIENT_ID
    if (!clientId) {
      return res.status(503).json({ message: 'Google Sign-In not configured' })
    }
    // Lightweight verification via tokeninfo
    const r = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(id_token)}`)
    if (!r.ok) {
      const text = await r.text()
      return res.status(401).json({ message: 'Invalid Google token', detail: text })
    }
    const info = await r.json()
    if (!info || info.aud !== clientId) {
      return res.status(401).json({ message: 'Invalid audience' })
    }
    const user = {
      sub: info.sub,
      email: info.email,
      name: info.name,
      picture: info.picture,
    }
    const token = jwt.sign(user, process.env.JWT_SECRET || 'dev_secret', { expiresIn: '7d' })
    return res.json({ token, user })
  } catch (err) {
    return res.status(500).json({ message: 'Auth failed' })
  }
}
