'use strict'

const __ = require('../services/log-service')

__('Trying load routes/device-route.js')

const express = require('express')
const router = express.Router()
const controller = require('../controllers/device-controller')
const deviceAuth = require('../auth/device-auth')

router.post('/', controller.save)
router.put('/', controller.save)
router.post('/renew', deviceAuth.renewToken)

module.exports = router
