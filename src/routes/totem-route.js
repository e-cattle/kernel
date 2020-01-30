'use strict'

const __ = require('../services/log-service')

__('Trying load routes/totem-route.js')

const express = require('express')
const router = express.Router()

const totemAuth = require('../auth/totem-auth')
const qrAuth = require('../auth/qr-auth')
const appAuth = require('../auth/application-auth')

const os = require('os')
const osUtils = require('os-utils')
const diskspace = require('diskspace')
const si = require('systeminformation')

__('Registering GET /totem/system route...')

router.get('/system', (req, res, next) => {
  osUtils.cpuUsage((cpu) => {
    si.networkStats((nwstats) => {
      res.status(200).send({
        uptime: os.uptime(),
        memory: 100 - (osUtils.freememPercentage() * 100),
        cpu: cpu,
        tx: (nwstats[0].tx_bytes * 0.000001),
        rx: (nwstats[0].rx_bytes * 0.000001)
      })
    })
  })
})

__('Registering GET /totem/disk route...')

router.get('/disk', (req, res, next) => {
  var mount = os.arch() !== 'arm64' ? '/' : '/home'

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

__('Registering GET /totem/token route...')

router.get('/token', totemAuth.token)

__('Registering GET /totem/qr route...')

router.get('/qr', qrAuth.token)

const device = require('../controllers/device-controller')

__('Registering GET /totem/devices route...')

router.get('/devices', totemAuth.authorize, device.all)

__('Registering PUT /totem/device/enable/:mac route...')

router.put('/device/enable/:mac', totemAuth.authorize, device.enable)

__('Registering PUT /totem/device/disable/:mac route...')

router.put('/device/disable/:mac', totemAuth.authorize, device.disable)

__('Registering DELETE /totem/device/:mac route...')

router.delete('/device/:mac', totemAuth.authorize, device.delete)

/*
 * Application
 */

const application = require('../controllers/application-controller')

__('Registering POST /totem/connect route...')
router.post('/connect', appAuth.authorize, application.save)

__('Registering GET /totem/applications route...')
router.get('/applications', totemAuth.authorize, application.all)

__('Registering PUT /totem/application/enable/:_id route...')

router.put('/application/enable/:_id', totemAuth.authorize, application.enable)

__('Registering PUT /totem/application/disable/:_id route...')

router.put('/application/disable/:_id', totemAuth.authorize, application.disable)

__('Registering DELETE /totem/application/disable/:_id route...')

router.delete('/application/remove/:_id', totemAuth.authorize, application.remove)

/*
 * Cloud
 */

const cloud = require('../controllers/cloud-controller')

__('Registering GET /totem/cloud/token route...')
router.get('/cloud/token', async (req, res, next) => {
  try {
    await cloud.setToken()

    res.json({
      ok: 'ok'
    })
  } catch (error) {
    res.status(500).send('Error to get Kernel status: ' + error)
  }
})

module.exports = router
