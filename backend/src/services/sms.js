// Simple SMS abstraction supporting Nepal Telecom (placeholder) and Twilio fallback

async function sendViaNTC(to, message) {
  const base = process.env.NTC_API_BASE
  const user = process.env.NTC_USERNAME
  const pass = process.env.NTC_PASSWORD
  const sender = process.env.NTC_SENDER_ID
  if (!base || !user || !pass || !sender) return false
  try {
    // TODO: Replace with actual NTC HTTP API once available
    // await fetch(`${base}/send`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ to, message, user, pass, sender }) })
    console.log('[NTC SMS]', { to, message })
    return true
  } catch (e) {
    console.error('NTC SMS failed', e)
    return false
  }
}

async function sendViaTwilio(to, message) {
  const sid = process.env.TWILIO_ACCOUNT_SID
  const token = process.env.TWILIO_AUTH_TOKEN
  const from = process.env.TWILIO_FROM
  if (!sid || !token || !from) return false
  try {
    const twilio = require('twilio')(sid, token)
    await twilio.messages.create({ to, from, body: message })
    return true
  } catch (e) {
    console.error('Twilio SMS failed', e)
    return false
  }
}

exports.sendSms = async function sendSms(to, message) {
  // Prefer NTC if configured
  if (await sendViaNTC(to, message)) return true
  // Fallback to Twilio
  if (await sendViaTwilio(to, message)) return true
  // No providers configured; no-op
  console.log('[SMS noop]', { to, message })
  return false
}
