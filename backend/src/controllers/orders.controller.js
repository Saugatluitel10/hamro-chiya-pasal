// In-memory orders store (replace with MongoDB in production)
const orders = []
const sms = require('../services/sms')

function makeId() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36)
}

exports.createOrder = async (req, res) => {
  try {
    const { items, customer, paymentMethod } = req.body || {}
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'No items' })
    }
    const normalized = items.map((it) => ({
      name: String(it.name || ''),
      qty: Number(it.qty || 1),
      priceNpr: Number(it.priceNpr || 0),
    }))
    if (normalized.some((it) => !it.name || it.qty <= 0)) {
      return res.status(400).json({ message: 'Invalid item' })
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
    try {
      if (order.customer && order.customer.phone) {
        sms.sendSms(String(order.customer.phone), `Hamro Chiya Pasal: Order ${id} received. Total NPR ${totalNpr}.`)
      }
    } catch {}
    return res.json({ id, totalNpr, status: order.status, items: normalized })
  } catch (e) {
    return res.status(500).json({ message: 'Failed to create order' })
  }
}

exports.getOrder = async (req, res) => {
  const { id } = req.params
  const order = orders.find((o) => o.id === id)
  if (!order) return res.status(404).json({ message: 'Not found' })
  return res.json(order)
}

exports.findById = function findById(id) {
  return orders.find((o) => o.id === id)
}

exports.markPaid = async function markPaid(id, paymentInfo) {
  const order = orders.find((o) => o.id === id)
  if (!order) return false
  order.status = 'paid'
  order.paidAt = Date.now()
  order.payment = Object.assign({}, order.payment, paymentInfo)
  try {
    if (order.customer && order.customer.phone) {
      sms.sendSms(String(order.customer.phone), `Hamro Chiya Pasal: Payment received for order ${id}. Thank you!`)
    }
  } catch {}
  return true
}
