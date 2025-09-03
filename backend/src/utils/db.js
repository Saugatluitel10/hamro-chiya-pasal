const mongoose = require('mongoose')

async function connectDB() {
  const uri = process.env.MONGODB_URI
  if (!uri) {
    console.warn('[DB] MONGODB_URI not set. Skipping MongoDB connection for now.')
    return null
  }
  try {
    await mongoose.connect(uri)
    console.log('[DB] MongoDB connected')

    mongoose.connection.on('error', (err) => {
      console.error('[DB] MongoDB connection error:', err?.message || err)
    })

    mongoose.connection.on('disconnected', () => {
      console.warn('[DB] MongoDB disconnected')
    })

    return mongoose
  } catch (err) {
    console.error('[DB] Failed to connect to MongoDB:', err?.message || err)
    throw err
  }
}

module.exports = connectDB
