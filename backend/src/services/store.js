// Optional MongoDB-backed store; falls back to no-op if mongoose is unavailable
let mongoose
let OrderModel
let ready = false

async function init() {
  try {
    // Dynamically require mongoose; if not installed, skip
    // eslint-disable-next-line global-require
    mongoose = require('mongoose')
  } catch {
    ready = false
    return
  }
  const uri = process.env.MONGODB_URI
  if (!uri) {
    ready = false
    return
  }
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(uri, { dbName: process.env.MONGODB_DB || undefined })
  }
  if (!OrderModel) {
    const ItemSchema = new mongoose.Schema(
      {
        name: String,
        qty: Number,
        priceNpr: Number,
      },
      { _id: false }
    )
    const OrderSchema = new mongoose.Schema(
      {
        id: { type: String, index: true, unique: true },
        items: [ItemSchema],
        customer: { type: Object, default: null },
        paymentMethod: String,
        totalNpr: Number,
        status: { type: String, index: true },
        createdAt: Number,
        paidAt: Number,
        payment: Object,
      },
      { versionKey: false }
    )
    OrderModel = mongoose.model('orders', OrderSchema)
  }
  ready = true
}

// Fire and forget
init().catch(() => { ready = false })

exports.isReady = () => ready && OrderModel

exports.create = async function create(order) {
  if (!exports.isReady()) return false
  try {
    await OrderModel.create(order)
    return true
  } catch {
    return false
  }
}

exports.findById = async function findById(id) {
  if (!exports.isReady()) return null
  try {
    const doc = await OrderModel.findOne({ id }).lean()
    return doc || null
  } catch {
    return null
  }
}

exports.markPaid = async function markPaid(id, paymentInfo) {
  if (!exports.isReady()) return false
  try {
    const res = await OrderModel.updateOne(
      { id },
      { $set: { status: 'paid', paidAt: Date.now(), payment: paymentInfo } }
    )
    return res.modifiedCount > 0
  } catch {
    return false
  }
}
