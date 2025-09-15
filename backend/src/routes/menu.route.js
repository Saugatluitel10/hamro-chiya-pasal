const express = require('express')
const { listCategories, searchTeas } = require('../controllers/menu.controller')

const router = express.Router()

router.get('/', listCategories)
router.get('/search', searchTeas)

module.exports = router
