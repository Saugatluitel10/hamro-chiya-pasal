const express = require('express')
const { createRateLimit } = require('../middleware/rateLimit')
const { subscribe, confirm, unsubscribeRequest, unsubscribeConfirm } = require('../controllers/newsletter.controller')

const router = express.Router()

// Simple rate limits
const limit = createRateLimit({ windowMs: 60_000, max: 10 })

router.post('/subscribe', limit, subscribe)
router.get('/confirm', confirm)
router.post('/unsubscribe', limit, unsubscribeRequest)
router.get('/unsubscribe', unsubscribeConfirm)

module.exports = router
