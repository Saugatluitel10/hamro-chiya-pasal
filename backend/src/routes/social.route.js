const express = require('express')
const { fetchInstagram, submitUGC, getMetrics, trackHit, listUGC, getRefStats, orderShareReady, getGoogleReviews } = require('../controllers/social.controller')

const router = express.Router()

router.get('/instagram', fetchInstagram)
router.post('/ugc', submitUGC)
router.get('/metrics', getMetrics)
router.get('/ugc', listUGC)
router.post('/track', trackHit)
router.get('/refstats', getRefStats)
router.post('/order/share-ready', orderShareReady)
router.get('/google/reviews', getGoogleReviews)

module.exports = router
