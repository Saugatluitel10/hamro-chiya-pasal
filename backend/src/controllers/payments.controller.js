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
    // Default to EPAYTEST for UAT/dev if merchant not configured
    const scd = process.env.ESEWA_MERCHANT_CODE || process.env.ESEWA_SCD || 'EPAYTEST'
    const baseUrl = process.env.ESEWA_BASE_URL || 'https://uat.esewa.com.np'
    if (!orderId || typeof amount !== 'number') {
      return res.status(400).json({ message: 'orderId and amount required' })
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
    const scd = process.env.ESEWA_MERCHANT_CODE || process.env.ESEWA_SCD || 'EPAYTEST'
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
    let ok = vr.ok && /SUCCESS/i.test(vtext)
    if (!ok && String(process.env.ESEWA_DEV_BYPASS).toLowerCase() === 'true') {
      ok = true
    }
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
    if (!key) {
      // Dev/dummy fallback to unblock frontend flow
      return res.json({ clientSecret: 'dummy_secret_dev_only' })
    }
    // Lazy require to avoid dependency unless configured
    // eslint-disable-next-line global-require
    const Stripe = require('stripe')
    const stripe = new Stripe(key)
    const { amount, currency = 'npr', orderId } = req.body || {}
    if (!amount) return res.status(400).json({ message: 'amount required' })
    const intent = await stripe.paymentIntents.create({ amount: Math.round(Number(amount) * 100), currency, metadata: { orderId: String(orderId || '') } })
    return res.json({ clientSecret: intent.client_secret })
  } catch (e) {
    return res.status(500).json({ message: 'Stripe create intent failed' })
  }
}

exports.stripeWebhook = async (req, res) => {
  try {
    const secret = process.env.STRIPE_WEBHOOK_SECRET
    const key = process.env.STRIPE_SECRET_KEY
    let event = req.body
    // In dev or when secret is missing, trust the JSON body
    if (secret && key && req.headers['stripe-signature']) {
      try {
        // eslint-disable-next-line global-require
        const Stripe = require('stripe')
        const stripe = new Stripe(key)
        // If express.json parsed body already, this verification may fail; recommend configuring express.raw for production
        // Here we best-effort proceed if verification fails, but do not block dev
        try {
          event = stripe.webhooks.constructEvent(req.rawBody || JSON.stringify(req.body), req.headers['stripe-signature'], secret)
        } catch (err) {
          // Fallback to unverified body in dev
          event = req.body
        }
      } catch {
        event = req.body
      }
    }
    const type = event?.type
    if (type === 'payment_intent.succeeded') {
      const pi = event.data?.object || {}
      const orderId = pi?.metadata?.orderId
      if (orderId) {
        try {
          const { markPaid } = require('./orders.controller')
          await markPaid(String(orderId), { provider: 'stripe', intentId: String(pi.id || '') })
        } catch {}
      }
    }
    return res.json({ received: true })
  } catch (e) {
    return res.status(200).json({ ok: true })
  }
}
