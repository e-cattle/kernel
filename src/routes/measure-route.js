'use strict'

const __ = require('../services/log-service')

__('Trying load routes/measure-route.js')

const express = require('express')
const router = express.Router()
const controller = require('../controllers/measure-controller')
const deviceAuth = require('../auth/device-auth')

__('Registering POST /measure route...')

router.post('/', deviceAuth.authorize, controller.collect)

module.exports = router
