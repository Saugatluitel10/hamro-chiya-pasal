const express = require('express')
const { googleSignIn } = require('../controllers/auth.controller')

const router = express.Router()

router.post('/google', googleSignIn)

module.exports = router
