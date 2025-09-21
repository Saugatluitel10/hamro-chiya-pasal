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

const app = express()

app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:5173'],
  credentials: true,
}))
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
