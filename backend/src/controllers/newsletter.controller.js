const crypto = require('crypto')
const { sendMail } = require('../utils/mailer')

// In-memory store (for demo). Replace with MongoDB collection in production.
const subscribers = new Set()
const tokens = new Map() // token -> { email, action: 'confirm'|'unsubscribe', createdAt }

function isValidEmail(email) {
  return /.+@.+\..+/.test(email)
}

function makeToken() {
  return crypto.randomBytes(24).toString('hex')
}

function appBaseUrl(req) {
  // Frontend URL for links; fallback to request origin
  const envUrl = process.env.FRONTEND_URL
  if (envUrl) return envUrl.replace(/\/$/, '')
  const proto = req.headers['x-forwarded-proto'] || req.protocol
  const host = req.headers['x-forwarded-host'] || req.get('host')
  return `${proto}://${host}`
}

exports.subscribe = async (req, res, next) => {
  try {
    const { email } = req.body || {}
    if (!email || !isValidEmail(email)) {
      res.status(400)
      throw new Error('Please provide a valid email address')
    }

    // If already subscribed, return ok idempotently
    if (subscribers.has(email.toLowerCase())) {
      return res.json({ ok: true, message: 'You are already subscribed.' })
    }

    const token = makeToken()
    tokens.set(token, { email: email.toLowerCase(), action: 'confirm', createdAt: Date.now() })

    const site = appBaseUrl(req)
    const link = `${site}/api/newsletter/confirm?token=${token}`
    const subject = 'Confirm your subscription — Hamro Chiya Pasal'
    const text = `Namaste!\n\nPlease confirm your subscription by clicking the link below:\n${link}\n\nIf you did not request this, ignore this email.`
    const html = `<p>Namaste!</p><p>Please confirm your subscription by clicking the link below:</p><p><a href="${link}">${link}</a></p><p>If you did not request this, ignore this email.</p>`

    await sendMail({ subject, text, html, to: email })

    return res.json({ ok: true, message: 'Confirmation email sent. Please check your inbox.' })
  } catch (err) {
    return next(err)
  }
}

exports.confirm = async (req, res) => {
  const { token } = req.query
  const rec = tokens.get(String(token || ''))
  if (!rec || rec.action !== 'confirm') {
    res.status(400)
    return res.json({ ok: false, message: 'Invalid or expired token' })
  }
  subscribers.add(rec.email)
  tokens.delete(String(token))
  return res.json({ ok: true, message: 'Subscription confirmed. Thank you!' })
}

exports.unsubscribeRequest = async (req, res, next) => {
  try {
    const { email } = req.body || {}
    if (!email || !isValidEmail(email)) {
      res.status(400)
      throw new Error('Please provide a valid email address')
    }
    if (!subscribers.has(email.toLowerCase())) {
      return res.json({ ok: true, message: 'You are already unsubscribed.' })
    }
    const token = makeToken()
    tokens.set(token, { email: email.toLowerCase(), action: 'unsubscribe', createdAt: Date.now() })
    const site = appBaseUrl(req)
    const link = `${site}/api/newsletter/unsubscribe?token=${token}`
    const subject = 'Confirm unsubscribe — Hamro Chiya Pasal'
    const text = `To unsubscribe, click:\n${link}`
    const html = `<p>To unsubscribe, click the link:</p><p><a href="${link}">${link}</a></p>`
    await sendMail({ subject, text, html, to: email })
    return res.json({ ok: true, message: 'Unsubscribe confirmation sent to your email.' })
  } catch (err) {
    return next(err)
  }
}

exports.unsubscribeConfirm = async (req, res) => {
  const { token } = req.query
  const rec = tokens.get(String(token || ''))
  if (!rec || rec.action !== 'unsubscribe') {
    res.status(400)
    return res.json({ ok: false, message: 'Invalid or expired token' })
  }
  subscribers.delete(rec.email)
  tokens.delete(String(token))
  return res.json({ ok: true, message: 'You have been unsubscribed.' })
}
