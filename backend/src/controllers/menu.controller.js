const Category = require('../models/Category')
const { getSeedCategories } = require('../data/teas')

async function readCategoriesFromDB() {
  try {
    const docs = await Category.find({}).lean().exec()
    return docs && Array.isArray(docs) ? docs : []
  } catch (err) {
    // DB not configured or unavailable
    return []
  }

// PATCH /api/menu/:key/teas/:titleEnglish
// Body: { available?: boolean, priceNpr?: number }
// Note: Admin-ready endpoint; add auth middleware in routes when admin is implemented
exports.updateTea = async (req, res) => {
  const { key, titleEnglish } = req.params
  const { available, priceNpr } = req.body || {}

  // Must have DB to persist
  if (!process.env.MONGODB_URI) {
    res.status(503)
    return res.json({ ok: false, message: 'Database not configured' })
  }

  if (typeof available === 'undefined' && typeof priceNpr === 'undefined') {
    res.status(400)
    return res.json({ ok: false, message: 'Provide at least one field: available or priceNpr' })
  }
  const setDoc = {}
  if (typeof available !== 'undefined') setDoc['teas.$.available'] = Boolean(available)
  if (typeof priceNpr !== 'undefined') {
    const n = Number(priceNpr)
    if (!Number.isFinite(n) || n < 0) {
      res.status(400)
      return res.json({ ok: false, message: 'priceNpr must be a non-negative number' })
    }
    setDoc['teas.$.priceNpr'] = n
  }

  try {
    const result = await Category.updateOne(
      { key, 'teas.titleEnglish': titleEnglish },
      { $set: setDoc }
    ).exec()

    if (!result.matchedCount) {
      res.status(404)
      return res.json({ ok: false, message: 'Tea not found for given category/titleEnglish' })
    }
    return res.json({ ok: true })
  } catch (err) {
    res.status(500)
    return res.json({ ok: false, message: 'Failed to update tea' })
  }
}
}

exports.listCategories = async (_req, res) => {
  // If DB is not configured, immediately return seed data
  if (!process.env.MONGODB_URI) {
    return res.json({ categories: getSeedCategories() })
  }

  // Try DB first
  let categories = await readCategoriesFromDB()

  if (!categories.length) {
    // Fallback to seed
    const seed = getSeedCategories()

    // If DB is available, attempt to seed it (best-effort)
    try {
      await Category.insertMany(seed, { ordered: false })
      categories = await readCategoriesFromDB()
    } catch (_) {
      // Ignore insert errors in case of duplicates or no DB
      categories = seed
    }

    // If still empty after attempted insert, just return seed
    if (!categories.length) categories = seed
  }

  return res.json({ categories })
}

// Helper to parse query params safely
function toNumber(v, def) {
  const n = Number(v)
  return Number.isFinite(n) ? n : def
}

// GET /api/menu/search
// Query params: q, minPrice, maxPrice, category (key), sort (price_asc|price_desc|popularity_desc|name_asc), available (true|false)
exports.searchTeas = async (req, res) => {
  const q = (req.query.q || '').toString().trim()
  const categoryKey = (req.query.category || '').toString().trim()
  const availableParam = (req.query.available || '').toString().trim().toLowerCase()
  const available = availableParam === 'true' ? true : availableParam === 'false' ? false : undefined
  const minPrice = toNumber(req.query.minPrice, undefined)
  const maxPrice = toNumber(req.query.maxPrice, undefined)
  const sort = (req.query.sort || 'name_asc').toString().trim()

  const textMatch = (nameNe, nameEn) => {
    if (!q) return true
    const hay = `${nameNe || ''} ${nameEn || ''}`.toLowerCase()
    return hay.includes(q.toLowerCase())
  }

  const withinPrice = (price) => {
    if (typeof price !== 'number') return true
    if (typeof minPrice === 'number' && price < minPrice) return false
    if (typeof maxPrice === 'number' && price > maxPrice) return false
    return true
  }

  // If DB is not configured, search/filter over seed data in-memory
  if (!process.env.MONGODB_URI) {
    const base = getSeedCategories()
    const filtered = base
      .filter((c) => (categoryKey ? c.key === categoryKey : true))
      .map((c) => ({
        ...c,
        teas: c.teas.filter((t) => {
          const avail = typeof available === 'boolean' ? (typeof t.available === 'boolean' ? t.available === available : available === true) : true
          return (
            avail &&
            textMatch(t.titleNepali, t.titleEnglish) &&
            withinPrice(t.priceNpr)
          )
        }),
      }))
      .map((c) => ({ ...c, teas: sortTeas(c.teas, sort) }))
      .filter((c) => c.teas.length)

    return res.json({ categories: filtered })
  }

  // DB-backed search using aggregation over embedded teas
  try {
    const pipeline = []
    // Optional category filter
    if (categoryKey) {
      pipeline.push({ $match: { key: categoryKey } })
    }
    pipeline.push({ $unwind: '$teas' })

    // Build $and conditions on teas
    const andConds = []
    if (q) {
      const rx = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')
      andConds.push({ $or: [{ 'teas.titleNepali': rx }, { 'teas.titleEnglish': rx }] })
    }
    if (typeof available === 'boolean') {
      andConds.push({ $or: [
        { 'teas.available': available },
        // Handle documents without the field: default to true
        { $and: [ { 'teas.available': { $exists: false } }, { $expr: { $eq: [available, true] } } ] },
      ] })
    }
    if (typeof minPrice === 'number') andConds.push({ 'teas.priceNpr': { $gte: minPrice } })
    if (typeof maxPrice === 'number') andConds.push({ 'teas.priceNpr': { $lte: maxPrice } })
    if (andConds.length) pipeline.push({ $match: { $and: andConds } })

    // Sorting
    const sortStage = {}
    switch (sort) {
      case 'price_desc':
        sortStage['teas.priceNpr'] = -1
        break
      case 'popularity_desc':
        sortStage['teas.popularity'] = -1
        break
      case 'name_asc':
        sortStage['teas.titleEnglish'] = 1
        sortStage['teas.titleNepali'] = 1
        break
      case 'price_asc':
      default:
        sortStage['teas.priceNpr'] = 1
        break
    }
    pipeline.push({ $sort: sortStage })

    // Regroup back into categories
    pipeline.push({
      $group: {
        _id: '$key',
        key: { $first: '$key' },
        titleNepali: { $first: '$titleNepali' },
        titleEnglish: { $first: '$titleEnglish' },
        teas: { $push: '$teas' },
      },
    })
    pipeline.push({ $project: { _id: 0, key: 1, titleNepali: 1, titleEnglish: 1, teas: 1 } })

    const agg = await Category.aggregate(pipeline).exec()
    return res.json({ categories: agg })
  } catch (err) {
    // On any error, gracefully degrade to seed search
    const base = getSeedCategories()
    const filtered = base
      .filter((c) => (categoryKey ? c.key === categoryKey : true))
      .map((c) => ({
        ...c,
        teas: c.teas.filter((t) => {
          const avail = typeof available === 'boolean' ? (typeof t.available === 'boolean' ? t.available === available : available === true) : true
          return (
            avail &&
            textMatch(t.titleNepali, t.titleEnglish) &&
            withinPrice(t.priceNpr)
          )
        }),
      }))
      .map((c) => ({ ...c, teas: sortTeas(c.teas, sort) }))
      .filter((c) => c.teas.length)
    return res.json({ categories: filtered, fallback: true })
  }
}

function sortTeas(teas, sort) {
  const arr = Array.isArray(teas) ? [...teas] : []
  switch (sort) {
    case 'price_desc':
      return arr.sort((a, b) => (b.priceNpr || 0) - (a.priceNpr || 0))
    case 'popularity_desc':
      return arr.sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
    case 'name_asc':
      return arr.sort((a, b) => (a.titleEnglish || a.titleNepali || '').localeCompare(b.titleEnglish || b.titleNepali || ''))
    case 'price_asc':
    default:
      return arr.sort((a, b) => (a.priceNpr || 0) - (b.priceNpr || 0))
  }
}
