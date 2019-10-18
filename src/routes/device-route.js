'use strict'

const express = require('express')
const router = express.Router()
const controller = require('../controllers/device-controller')
const authService = require('../services/auth-service')

router.post('/', controller.save)
router.put('/', controller.save)
router.post('/renew', authService.renewToken)

module.exports = router
