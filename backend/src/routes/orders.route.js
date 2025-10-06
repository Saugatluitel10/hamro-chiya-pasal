const express = require('express')
const { createOrder, getOrder, listRecent, updateStatus } = require('../controllers/orders.controller')
const events = require('../services/events')
const adminOrKey = require('../middleware/adminOrKey')

const router = express.Router()

router.post('/', createOrder)
router.get('/:id', getOrder)
router.get('/:id/events', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  })
  events.subscribe(req.params.id, res)
})

// Admin endpoints
router.get('/', adminOrKey, listRecent)
router.patch('/:id/status', adminOrKey, updateStatus)

module.exports = router
