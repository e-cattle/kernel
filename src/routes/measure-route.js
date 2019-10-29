'use strict'

console.log('MEASURE - Trying load routes/measure-route.js')

const express = require('express')
const router = express.Router()
const controller = require('../controllers/measure-controller')
const deviceAuth = require('../auth/device-auth')

router.post('/', deviceAuth.authorize, controller.collect)

module.exports = router
