const { sendMail } = require('../utils/mailer')

function isValidEmail(email) {
  return /.+@.+\..+/.test(email)
}

exports.createInquiry = async (req, res, next) => {
  try {
    const {
      name,
      email,
      phone,
      messageType, // inquiry | feedback | catering
      preferredContact, // email | phone | whatsapp
      message,
      hp, // honeypot field: should be empty; bots often fill it
    } = req.body || {}

    // Honeypot check: if filled, silently accept without processing
    if (typeof hp === 'string' && hp.trim().length > 0) {
      return res.status(200).json({ ok: true, message: 'धन्यवाद!' })
    }

    if (!name || (!email && !phone)) {
      res.status(400)
      throw new Error('Please provide your name and at least one contact: email or phone')
    }

    if (email && !isValidEmail(email)) {
      res.status(400)
      throw new Error('Please provide a valid email address')
    }

    const subject = `New ${messageType || 'inquiry'} from ${name}`

    const lines = [
      `Name: ${name}`,
      `Email: ${email || '—'}`,
      `Phone: ${phone || '—'}`,
      `Preferred Contact: ${preferredContact || '—'}`,
      `Type: ${messageType || 'inquiry'}`,
      '',
      'Message:',
      message || '—',
      '',
      `Submitted: ${new Date().toISOString()}`,
    ]

    const text = lines.join('\n')
    const html = `<pre style="font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace; white-space: pre-wrap">${text}</pre>`

    await sendMail({ subject, text, html })

    return res.status(200).json({ ok: true, message: 'धन्यवाद! We received your message and will respond soon.' })
  } catch (err) {
    return next(err)
  }
}
