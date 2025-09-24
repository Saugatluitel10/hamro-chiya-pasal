const express = require('express')
const { createOrder, getOrder } = require('../controllers/orders.controller')
const events = require('../services/events')

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

module.exports = router
