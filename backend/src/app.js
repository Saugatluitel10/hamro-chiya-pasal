const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const healthRouter = require('./routes/health.route')
const contactRouter = require('./routes/contact.route')
const menuRouter = require('./routes/menu.route')
const blogRouter = require('./routes/blog.route')
const newsletterRouter = require('./routes/newsletter.route')
const socialRouter = require('./routes/social.route')
const authRouter = require('./routes/auth.route')
const ordersRouter = require('./routes/orders.route')
const paymentsRouter = require('./routes/payments.route')
const errorHandler = require('./middleware/errorHandler')
const securityHeaders = require('./middleware/securityHeaders')
const logger = require('./logger')

const app = express()

// Derive allowed origins from env; default to localhost for dev
const rawOrigins = (process.env.CORS_ORIGIN || '').split(',').map((s) => s.trim()).filter(Boolean)
const defaultOrigins = ['http://localhost:5173', 'http://127.0.0.1:5173']
const allowOrigins = rawOrigins.length ? rawOrigins : defaultOrigins
if (!rawOrigins.length) {
  // eslint-disable-next-line no-console
  logger.warn('[CORS] CORS_ORIGIN not set; allowing dev defaults:', defaultOrigins.join(', '))
}
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true) // allow same-origin or curl
    if (allowOrigins.includes(origin)) return callback(null, true)
    // eslint-disable-next-line no-console
    logger.warn('[CORS] Blocked origin:', origin)
    return callback(new Error('Not allowed by CORS'))
  },
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Admin-Key'],
  exposedHeaders: ['Content-Length'],
}))
// Apply minimal security headers
app.use(securityHeaders)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'))

// Root OK for platform health checks
app.get('/', (_req, res) => {
  res.json({ status: 'ok', service: 'hamro-chiya-pasal-api' })
})

app.get('/api', (_req, res) => {
  res.json({ status: 'ok', service: 'hamro-chiya-pasal-api' })
})

app.use('/api/health', healthRouter)
app.use('/api/contact', contactRouter)
app.use('/api/menu', menuRouter)
app.use('/api/blog', blogRouter)
app.use('/api/newsletter', newsletterRouter)
app.use('/api/social', socialRouter)
app.use('/api/auth', authRouter)
app.use('/api/orders', ordersRouter)
app.use('/api/payments', paymentsRouter)

// Not found handler
app.use((req, res, next) => {
  res.status(404)
  next(new Error(`Not Found - ${req.originalUrl}`))
})

// Central error handler
app.use(errorHandler)

module.exports = app
