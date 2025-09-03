const dotenv = require('dotenv')
const http = require('http')
const app = require('./app')
const connectDB = require('./utils/db')

dotenv.config()

const PORT = process.env.PORT || 5000

;(async () => {
  try {
    await connectDB()
  } catch (err) {
    console.warn('[Server] Continuing without DB due to connection error.')
  }

  const server = http.createServer(app)

  server.listen(PORT, () => {
    console.log(`API server running on http://localhost:${PORT}`)
  })

  process.on('unhandledRejection', (reason) => {
    console.error('[UnhandledRejection]', reason)
  })

  process.on('uncaughtException', (err) => {
    console.error('[UncaughtException]', err)
  })
})()
