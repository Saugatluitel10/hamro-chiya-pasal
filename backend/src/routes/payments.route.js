const express = require('express')
const { esewaCreate, esewaSuccess, esewaFailure, stripeCreateIntent } = require('../controllers/payments.controller')

const router = express.Router()

// eSewa
router.post('/esewa/create', esewaCreate)
router.get('/esewa/success', esewaSuccess)
router.get('/esewa/failure', esewaFailure)

// Stripe
router.post('/stripe/create-intent', stripeCreateIntent)

module.exports = router
