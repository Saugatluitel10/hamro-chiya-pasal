const express = require('express')
const { listCategories, searchTeas, updateTea } = require('../controllers/menu.controller')
const adminGuard = require('../middleware/admin')

const router = express.Router()

router.get('/', listCategories)
router.get('/search', searchTeas)
router.patch('/:key/teas/:titleEnglish', express.json(), adminGuard, updateTea)

module.exports = router
