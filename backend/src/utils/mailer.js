const nodemailer = require('nodemailer')

function createTransport() {
  const {
    SMTP_HOST,
    SMTP_PORT,
    SMTP_USER,
    SMTP_PASS,
    SMTP_SECURE,
  } = process.env

  if (SMTP_HOST && SMTP_PORT && SMTP_USER && SMTP_PASS) {
    return nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT),
      secure: String(SMTP_SECURE || '').toLowerCase() === 'true',
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    })
  }

  // Dev fallback: log email to console instead of sending
  return nodemailer.createTransport({ jsonTransport: true })
}

const transporter = createTransport()

async function sendMail({ from, to, subject, text, html }) {
  const defaultFrom = process.env.MAIL_FROM || 'no-reply@hamro-chiya-pasal.local'
  const defaultTo = process.env.MAIL_TO || process.env.SMTP_USER || 'owner@example.com'

  const info = await transporter.sendMail({
    from: from || defaultFrom,
    to: to || defaultTo,
    subject,
    text,
    html,
  })

  // When jsonTransport is used, info.message is a JSON string. Log for visibility.
  if (info && info.message) {
    try {
      const parsed = JSON.parse(info.message.toString())
      // eslint-disable-next-line no-console
      console.log('Email (dev) JSON transport output:', parsed)
    } catch (_) {
      // eslint-disable-next-line no-console
      console.log('Email sent:', info.response || info)
    }
  }

  return info
}

module.exports = { sendMail }
