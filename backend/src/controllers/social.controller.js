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
  return key && process.env.ADMIN_KEY && String(key) === String(process.env.ADMIN_KEY)
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

module.exports = {
  fetchInstagram,
  submitUGC,
  getMetrics,
  trackHit,
  listUGC,
  getRefStats,
}
