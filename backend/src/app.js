const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const healthRouter = require('./routes/health.route')
const errorHandler = require('./middleware/errorHandler')

const app = express()

app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:5173'],
  credentials: true,
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'))

app.get('/api', (_req, res) => {
  res.json({ status: 'ok', service: 'hamro-chiya-pasal-api' })
})

app.use('/api/health', healthRouter)

// Not found handler
app.use((req, res, next) => {
  res.status(404)
  next(new Error(`Not Found - ${req.originalUrl}`))
})

// Central error handler
app.use(errorHandler)

module.exports = app
