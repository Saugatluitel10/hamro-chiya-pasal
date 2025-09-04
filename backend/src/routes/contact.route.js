const express = require('express')
const { createInquiry } = require('../controllers/contact.controller')
const { createRateLimit } = require('../middleware/rateLimit')

const router = express.Router()

// 5 requests per minute per IP (simple in-memory limiter)
const limit = createRateLimit({ windowMs: 60_000, max: 5 })

router.post('/', limit, createInquiry)

module.exports = router
