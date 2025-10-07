const fetchInstagram = async (req, res, next) => {
  try {
    const token = process.env.INSTAGRAM_ACCESS_TOKEN
    const limit = Math.min(parseInt(req.query.limit || '8', 10) || 8, 20)
    if (!token) {
      return res.status(503).json({ message: 'Instagram not configured' })
    }
    // Basic Display API - recent media
    const url = new URL('https://graph.instagram.com/me/media')
    url.searchParams.set('fields', 'id,caption,media_url,permalink,timestamp')
    url.searchParams.set('access_token', token)
    url.searchParams.set('limit', String(limit))

    const r = await fetch(url)
    if (!r.ok) {
      const text = await r.text()
      return res.status(502).json({ message: 'Instagram fetch failed', detail: text })
    }
    const data = await r.json()
    // Normalize to array
    const items = Array.isArray(data) ? data : data?.data || []
    return res.json(items)
  } catch (err) {
    next(err)
  }
}

// In-memory stores (replace with DB in production)
const ugcSubmissions = [] // { name, handle, postUrl, consent, submittedAt }
const hits = [] // { ts, path, ref, utm_source, utm_medium, utm_campaign }

const submitUGC = async (req, res, next) => {
  try {
    const { name, handle, postUrl, consent } = req.body || {}
    if (!consent) {
      res.status(400)
      throw new Error('Consent required')
    }
    if (!handle && !postUrl) {
      res.status(400)
      throw new Error('Instagram handle or post URL required')
    }
    ugcSubmissions.push({
      name: (name || '').toString().slice(0, 120),
      handle: (handle || '').toString().slice(0, 120),
      postUrl: (postUrl || '').toString().slice(0, 300),
      consent: !!consent,
      submittedAt: Date.now(),
    })
    return res.json({ ok: true })
  } catch (err) {
    next(err)
  }
}

function adminOk(req) {
  const key = req.headers['x-admin-key']
  if (key && process.env.ADMIN_KEY && String(key) === String(process.env.ADMIN_KEY)) return true
  try {
    const hdr = req.headers.authorization || ''
    const m = hdr.match(/^Bearer\s+(.+)$/i)
    if (!m) return false
    const token = m[1]
    const jwt = require('jsonwebtoken')
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret')
    const email = String(payload?.email || '')
    const allowed = (process.env.ALLOWED_ADMIN_EMAILS || '').split(',').map((s) => s.trim().toLowerCase()).filter(Boolean)
    if (!email) return false
    return allowed.includes(email.toLowerCase())
  } catch {
    return false
  }
}

const getMetrics = async (req, res) => {
  if (!adminOk(req)) {
    return res.status(401).json({ message: 'Unauthorized' })
  }
  // Placeholder values; wire external sources as needed
  const metrics = {
    googleReviews: { rating: 4.9, count: 124 },
    instagramFollowers: 1840,
    ugcCount: ugcSubmissions.length,
  }
  return res.json(metrics)
}

const listUGC = async (req, res) => {
  if (!adminOk(req)) {
    return res.status(401).json({ message: 'Unauthorized' })
  }
  return res.json({ items: ugcSubmissions.slice(-200).reverse() })
}

const trackHit = async (req, res) => {
  try {
    const { ref, utm_source, utm_medium, utm_campaign } = req.body || {}
    hits.push({ ts: Date.now(), path: req.headers['x-forwarded-path'] || req.path, ref, utm_source, utm_medium, utm_campaign })
    return res.json({ ok: true })
  } catch {
    return res.json({ ok: false })
  }
}

const getRefStats = async (req, res) => {
  if (!adminOk(req)) {
    return res.status(401).json({ message: 'Unauthorized' })
  }
  function countBy(key) {
    const map = new Map()
    for (const h of hits) {
      const k = (h[key] || '').toString()
      if (!k) continue
      map.set(k, (map.get(k) || 0) + 1)
    }
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]).map(([k, v]) => ({ key: k, count: v }))
  }
  return res.json({
    referrers: countBy('ref'),
    sources: countBy('utm_source'),
    campaigns: countBy('utm_campaign'),
  })
}

// Compose a shareable order string and helpful links
const orderShareReady = async (req, res) => {
  try {
    const { orderId, items, totalNpr } = req.body || {}
    const site = process.env.FRONTEND_URL || ''
    // Validate payload (lightweight)
    if (items !== undefined && !Array.isArray(items)) {
      res.status(400)
      throw new Error('items must be an array')
    }
    const normalized = Array.isArray(items)
      ? items.slice(0, 10).map((it) => ({ name: String(it.name || ''), qty: Number(it.qty || 1) }))
      : []
    if (normalized.some((it) => !it.name || !Number.isFinite(it.qty) || it.qty <= 0)) {
      res.status(400)
      throw new Error('Invalid items')
    }
    const tn = totalNpr === undefined || totalNpr === null ? undefined : Number(totalNpr)
    if (tn !== undefined && (!Number.isFinite(tn) || tn < 0)) {
      res.status(400)
      throw new Error('Invalid totalNpr')
    }
    const list = normalized.map((it) => `${it.qty || 1}× ${it.name}`).join(', ')
    const totalTxt = typeof totalNpr === 'number' ? ` — NPR ${totalNpr}` : ''
    const idTxt = orderId ? ` (Order #${orderId})` : ''
    const url = site ? `${site.replace(/\/$/, '')}/` : ''
    const text = `I just ordered chai: ${list}${totalTxt}${idTxt}. ${url} #HamroChiyaPasal`
    const w = encodeURIComponent(text)
    const share = {
      text,
      url,
      whatsapp: `https://wa.me/?text=${w}`,
      twitter: `https://twitter.com/intent/tweet?text=${w}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    }
    return res.json(share)
  } catch (err) {
    if (!res.statusCode || res.statusCode === 200) res.status(400)
    throw err instanceof Error ? err : new Error('Invalid order payload')
  }
}

// Google Places Reviews (cached)
let cachedReviews = { data: null, at: 0 }
const getGoogleReviews = async (_req, res) => {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY
  const placeId = process.env.GOOGLE_PLACE_ID
  if (!apiKey || !placeId) {
    return res.status(503).json({ message: 'Google Places not configured' })
  }
  const now = Date.now()
  if (cachedReviews.data && now - cachedReviews.at < 10 * 60 * 1000) {
    return res.json(cachedReviews.data)
  }
  const url = new URL('https://maps.googleapis.com/maps/api/place/details/json')
  url.searchParams.set('place_id', placeId)
  url.searchParams.set('fields', 'rating,user_ratings_total,reviews')
  url.searchParams.set('key', apiKey)
  const r = await fetch(url)
  const j = await r.json()
  if (j?.status !== 'OK') {
    return res.status(502).json({ message: 'Places API error', detail: j?.status })
  }
  const result = j.result || {}
  const reviews = Array.isArray(result.reviews) ? result.reviews.slice(0, 5).map((rv) => ({
    author_name: rv.author_name,
    rating: rv.rating,
    text: rv.text,
    time: rv.time,
    relative_time_description: rv.relative_time_description,
    profile_photo_url: rv.profile_photo_url,
  })) : []
  const data = {
    rating: result.rating || null,
    total: result.user_ratings_total || 0,
    reviews,
  }
  cachedReviews = { data, at: now }
  return res.json(data)
}

module.exports = {
  fetchInstagram,
  submitUGC,
  getMetrics,
  trackHit,
  listUGC,
  orderShareReady,
  getGoogleReviews,
  getRefStats,
}
