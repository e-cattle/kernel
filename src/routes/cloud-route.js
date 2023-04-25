'use strict'

const __ = require('../services/log-service')

__('Trying load routes/cloud-route.js')

const express = require('express')
const router = express.Router()
const controller = require('../controllers/cloud-controller')

router.post('/contracts', controller.syncContract)
router.post('/sensors', controller.syncContract)

module.exports = router
