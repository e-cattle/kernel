'use strict'

const __ = require('../services/log-service')

__('Trying load routes/cloud-route.js')

const express = require('express')
const router = express.Router()
const controller = require('../controllers/cloud-controller')
const cloudAuth = require('../auth/cloud-auth')

router.post('/contracts', cloudAuth.authorize, controller.syncContract)
router.post('/sensors', cloudAuth.authorize, controller.syncSensor)
router.post('/devices', cloudAuth.authorize, controller.syncDevice)
module.exports = router
