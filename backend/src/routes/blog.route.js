const express = require('express')
const { listPosts, getPost, relatedPosts, rss } = require('../controllers/blog.controller')

const router = express.Router()

router.get('/', listPosts)
router.get('/rss', rss)
router.get('/:slug', getPost)
router.get('/:slug/related', relatedPosts)

module.exports = router
