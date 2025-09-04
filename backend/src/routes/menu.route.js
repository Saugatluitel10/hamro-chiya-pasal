const express = require('express')
const { listCategories } = require('../controllers/menu.controller')

const router = express.Router()

router.get('/', listCategories)

module.exports = router
