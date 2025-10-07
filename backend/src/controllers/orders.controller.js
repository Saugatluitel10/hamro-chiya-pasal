// In-memory orders store (replace with MongoDB in production)
const orders = []
const sms = require('../services/sms')
const events = require('../services/events')
const store = require('../services/store')
const { ORDER_STATUS_SET } = require('../constants')

function makeId() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36)
}

exports.updateStatus = async (req, res) => {
  const { id } = req.params
  const { status } = req.body || {}
  if (!ORDER_STATUS_SET.has(String(status))) {
    res.status(400)
    throw new Error('Invalid status')
  }
  let order = orders.find((o) => o.id === id)
  if (!order) {
    try {
      const doc = await store.findById(id)
      if (doc) order = doc
    } catch {}
  }
  if (!order) {
    res.status(404)
    throw new Error('Not found')
  }
  order.status = String(status)
  try { await store.updateStatus(id, order.status) } catch {}
  try { events.publish(id, 'status', { status: order.status }) } catch {}
  try {
    if (order.status === 'ready' && order.customer && order.customer.phone) {
      sms.sendSms(String(order.customer.phone), `Hamro Chiya Pasal: Your order ${id} is ready for pickup/delivery.`)
    }
  } catch {}
  return res.json({ id, status: order.status })
}

exports.listRecent = async (req, res) => {
  const limit = Math.min(parseInt(req.query.limit || '100', 10) || 100, 200)
  try {
    const docs = await store.listRecent(limit)
    if (Array.isArray(docs) && docs.length) return res.json(docs)
  } catch {}
  // fallback to in-memory
  const sorted = orders.slice().sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)).slice(0, limit)
  return res.json(sorted)
}

exports.createOrder = async (req, res) => {
  try {
    const { items, customer, paymentMethod } = req.body || {}
    if (!Array.isArray(items) || items.length === 0) {
      res.status(400)
      throw new Error('No items')
    }
    const normalized = items.map((it) => ({
      name: String(it.name || ''),
      qty: Number(it.qty || 1),
      priceNpr: Number(it.priceNpr || 0),
    }))
    if (normalized.some((it) => !it.name || it.qty <= 0 || !Number.isFinite(it.qty) || it.priceNpr < 0 || !Number.isFinite(it.priceNpr))) {
      res.status(400)
      throw new Error('Invalid item')
    }
    const totalNpr = normalized.reduce((s, it) => s + it.qty * (isFinite(it.priceNpr) ? it.priceNpr : 0), 0)
    const id = makeId()
    const order = {
      id,
      items: normalized,
      customer: customer || null,
      paymentMethod: paymentMethod || 'cash',
      totalNpr,
      status: 'received',
      createdAt: Date.now(),
    }
    orders.push(order)
    try { await store.create(order) } catch {}
    try {
      if (order.customer && order.customer.phone) {
        sms.sendSms(String(order.customer.phone), `Hamro Chiya Pasal: Order ${id} received. Total NPR ${totalNpr}.`)
      }
    } catch {}
    try { events.publish(id, 'status', { status: order.status }) } catch {}
    return res.json({ id, totalNpr, status: order.status, items: normalized })
  } catch (e) {
    if (!res.statusCode || res.statusCode === 200) res.status(500)
    throw new Error('Failed to create order')
  }
}

exports.getOrder = async (req, res) => {
  const { id } = req.params
  let order = orders.find((o) => o.id === id)
  if (!order) {
    try {
      const doc = await store.findById(id)
      if (doc) order = doc
    } catch {}
  }
  if (!order) {
    res.status(404)
    throw new Error('Not found')
  }
  return res.json(order)
}

exports.findById = function findById(id) {
  return orders.find((o) => o.id === id)
}

exports.findByIdAsync = async function findByIdAsync(id) {
  const mem = orders.find((o) => o.id === id)
  if (mem) return mem
  try {
    const doc = await store.findById(id)
    if (doc) return doc
  } catch {}
  return null
}

exports.markPaid = async function markPaid(id, paymentInfo) {
  const order = orders.find((o) => o.id === id)
  if (!order) return false
  order.status = 'paid'
  order.paidAt = Date.now()
  order.payment = Object.assign({}, order.payment, paymentInfo)
  try { await store.markPaid(id, order.payment) } catch {}
  try {
    if (order.customer && order.customer.phone) {
      sms.sendSms(String(order.customer.phone), `Hamro Chiya Pasal: Payment received for order ${id}. Thank you!`)
    }
  } catch {}
  try { events.publish(id, 'status', { status: order.status }) } catch {}
  return true
}
