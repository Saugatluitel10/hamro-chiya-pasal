const express = require('express')
const { esewaCreate, esewaSuccess, esewaFailure, stripeCreateIntent, stripeWebhook } = require('../controllers/payments.controller')

const router = express.Router()

// eSewa
router.post('/esewa/create', esewaCreate)
router.get('/esewa/success', esewaSuccess)
router.get('/esewa/failure', esewaFailure)

// Stripe
router.post('/stripe/create-intent', stripeCreateIntent)
// Use express.raw for Stripe webhook signature verification
router.post('/stripe/webhook', express.raw({ type: 'application/json' }), stripeWebhook)

module.exports = router
