// Payments controller: eSewa (primary), Stripe (international) — scaffolding
// NOTE: Replace stubs with real integrations once credentials are provided.

function getFrontendUrl(req) {
  const envUrl = process.env.FRONTEND_URL
  if (envUrl) return envUrl.replace(/\/$/, '')
  const proto = req.headers['x-forwarded-proto'] || req.protocol
  const host = req.headers['x-forwarded-host'] || req.get('host')
  return `${proto}://${host}`
}

function getBackendUrl(req) {
  const envUrl = process.env.BACKEND_PUBLIC_URL
  if (envUrl) return envUrl.replace(/\/$/, '')
  const proto = req.headers['x-forwarded-proto'] || req.protocol
  const host = req.headers['x-forwarded-host'] || req.get('host')
  return `${proto}://${host}`
}

exports.esewaCreate = async (req, res) => {
  try {
    const { orderId, amount } = req.body || {}
    const scd = process.env.ESEWA_MERCHANT_CODE || process.env.ESEWA_SCD
    const baseUrl = process.env.ESEWA_BASE_URL || 'https://uat.esewa.com.np'
    if (!orderId || typeof amount !== 'number') {
      return res.status(400).json({ message: 'orderId and amount required' })
    }
    if (!scd) {
      return res.status(503).json({ message: 'eSewa not configured' })
    }
    // eSewa minimal fields
    // eSewa should call back to our backend endpoints
    const success = `${getBackendUrl(req)}/api/payments/esewa/success?oid=${encodeURIComponent(orderId)}`
    const failure = `${getBackendUrl(req)}/api/payments/esewa/failure?oid=${encodeURIComponent(orderId)}`
    const params = new URLSearchParams()
    params.set('amt', String(amount))
    params.set('pdc', '0')
    params.set('psc', '0')
    params.set('txAmt', '0')
    params.set('tAmt', String(amount))
    params.set('pid', orderId)
    params.set('scd', scd)
    params.set('su', success)
    params.set('fu', failure)
    const redirectUrl = `${baseUrl}/epay/main?${params.toString()}`
    return res.json({ redirectUrl })
  } catch (e) {
    return res.status(500).json({ message: 'eSewa create failed' })
  }
}

exports.esewaSuccess = async (req, res) => {
  const app = getFrontendUrl(req)
  try {
    // eSewa returns parameters like oid (our pid), amt, and refId (rid) to success URL (method may be GET)
    const oid = String(req.query.oid || req.body?.oid || '')
    const amt = String(req.query.amt || req.body?.amt || '')
    const rid = String(req.query.refId || req.query.rid || req.body?.refId || req.body?.rid || '')
    const scd = process.env.ESEWA_MERCHANT_CODE || process.env.ESEWA_SCD
    const verifyUrl = process.env.ESEWA_S2S_URL || 'https://uat.esewa.com.np/epay/transrec'
    if (!oid || !amt || !rid || !scd) {
      return res.redirect(`${app}/en/checkout?fail=${encodeURIComponent(oid || '')}`)
    }
    const params = new URLSearchParams()
    params.set('amt', amt)
    params.set('scd', scd)
    params.set('pid', oid)
    params.set('rid', rid)
    // Verify with eSewa S2S endpoint; expects SUCCESS in body on success
    const vr = await fetch(`${verifyUrl}?${params.toString()}`)
    const vtext = await vr.text()
    const ok = vr.ok && /SUCCESS/i.test(vtext)
    if (!ok) return res.redirect(`${app}/en/checkout?fail=${encodeURIComponent(oid)}`)
    // Mark order as paid in memory and redirect to success with id and total for UX
    try {
      const { markPaid, findById } = require('./orders.controller')
      await markPaid(oid, { provider: 'esewa', refId: rid, verified: true })
      const o = findById(oid)
      const qs = new URLSearchParams()
      qs.set('id', oid)
      if (o && typeof o.totalNpr === 'number') qs.set('total', String(o.totalNpr))
      return res.redirect(`${app}/en/order/success?${qs.toString()}`)
    } catch {
      return res.redirect(`${app}/en/order/success?id=${encodeURIComponent(oid)}`)
    }
  } catch (e) {
    return res.redirect(`${app}/en/checkout?fail=1`)
  }
}

exports.esewaFailure = async (req, res) => {
  const oid = req.query.oid
  const app = getFrontendUrl(req)
  return res.redirect(`${app}/en/checkout?fail=${encodeURIComponent(String(oid || ''))}`)
}

exports.stripeCreateIntent = async (req, res) => {
  try {
    const key = process.env.STRIPE_SECRET_KEY
    if (!key) return res.status(503).json({ message: 'Stripe not configured' })
    // Lazy require to avoid dependency unless configured
    // eslint-disable-next-line global-require
    const Stripe = require('stripe')
    const stripe = new Stripe(key)
    const { amount, currency = 'npr' } = req.body || {}
    if (!amount) return res.status(400).json({ message: 'amount required' })
    const intent = await stripe.paymentIntents.create({ amount: Math.round(Number(amount) * 100), currency })
    return res.json({ clientSecret: intent.client_secret })
  } catch (e) {
    return res.status(500).json({ message: 'Stripe create intent failed' })
  }
}
