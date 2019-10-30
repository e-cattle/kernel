'use strict'

const __ = require('../services/log-service')

__('Trying load routes/totem-route.js')

const express = require('express')
const router = express.Router()

const totemAuth = require('../auth/totem-auth')

const os = require('os')
const osUtils = require('os-utils')
const diskspace = require('diskspace')

__('Registering GET /totem/system route...')

router.get('/system', (req, res, next) => {
  osUtils.cpuUsage((cpu) => {
    res.status(200).send({
      uptime: os.uptime(),
      memory: 100 - osUtils.freememPercentage(),
      cpu: cpu
    })
  })
})

__('Registering GET /totem/disk route...')

router.get('/disk', (req, res, next) => {
  var mount = process.env.NODE_ENV !== 'production' ? '/' : '/writable'

  diskspace.check(mount, (err, result) => {
    if (err) {
      res.status(500).send(err)
    } else {
      res.status(200).send(result)
    }
  })
})

__('Registering GET /totem/data-by-type route...')

router.get('/data-by-type', (req, res, next) => {
  res.status(200).send({})
})

__('Registering GET /totem/data-by-day route...')

router.get('/data-by-day', (req, res, next) => {
  res.status(200).send({})
})

const device = require('../controllers/device-controller')

__('Registering GET /totem/devices route...')

router.get('/devices', totemAuth.authorize, device.all)

__('Registering PUT /totem/device/enable/:mac route...')

router.put('/device/enable/:mac', totemAuth.authorize, device.enable)

__('Registering PUT /totem/device/disable/:mac route...')

router.put('/device/disable/:mac', totemAuth.authorize, device.disable)

module.exports = router
