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
        rx: (nwstats[0].rx_bytes * 0.000001),
        iface: (nwstats[0].iface)
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

const graph = require('../controllers/graph-controller')

__('Registering GET /totem/count-by-type route...')

router.get('/count-by-type', totemAuth.authorize, graph.countByType)

__('Registering GET /totem/data-by-day route...')

router.get('/data-by-day', (req, res, next) => {
  res.status(200).send({})
})

__('Registering GET /totem/shutdown route...')

router.get('/shutdown', (req, res, next) => {
  var exec = require('child_process').exec
  exec('ssh -i /home/bigboxx/.ssh/id_rsa -o "StrictHostKeyChecking=no" bigboxx@localhost -C sudo /sbin/shutdown -h now', (err, result, stderr) => {
    if (err) {
      res.status(500).send(err, stderr)
    } else {
      res.status(200).send(result)
    }
  })
})

__('Registering GET /totem/reboot route...')

router.get('/reboot', (req, res, next) => {
  var exec = require('child_process').exec
  exec('ssh -i /home/bigboxx/.ssh/id_rsa -o "StrictHostKeyChecking=no" bigboxx@localhost -C sudo /sbin/shutdown -r now', (err, result, stderr) => {
    if (err) {
      res.status(500).send(err, stderr)
    } else {
      res.status(200).send(result)
    }
  })
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

const cloudController = require('../controllers/cloud-controller')
const infoService = require('../services/info-service')

__('Registering GET /totem/cloud/overview route...')
router.get('/cloud/overview', totemAuth.authorize, async (req, res, next) => {
  /*
  res.json({
    online: true,
    cloud: true,
    register: true,
    active: false,
    farm: 123
  })
  */

  var aux = null

  const online = await infoService.isOnline()
  const reachable = await infoService.isReachable()

  var cloud = false

  if (reachable) {
    cloud = await cloudController.status()
  }

  const registered = await cloudController.isRegistered()

  var active = false
  var approve = false

  if (registered) {
    aux = await cloudController.isActive()

    active = aux.active
    approve = aux.approve
  }

  var id = null

  if (registered) {
    id = await cloudController.getFarmId()
  }

  var farm = {
    name: '',
    location: '',
    country: ''
  }

  if (registered) {
    aux = await cloudController.getFarm()

    if (aux) {
      farm = aux
    }
  }

  const mac = await infoService.getMacAddress()

  res.json({
    mac: mac,
    online: online,
    cloud: cloud,
    register: registered,
    approve: approve,
    active: active,
    id: id,
    farm: farm
  })
})

__('Registering POST /totem/cloud/connect route...')
router.post('/cloud/connect', totemAuth.authorize, async (req, res, next) => {
  const mac = await infoService.getMacAddress()

  try {
    await cloudController.register(req.body.farm, mac)

    res.json({})
  } catch (error) {
    res.status(500).send('Error to connect: ' + error)
  }
})

__('Registering POST /totem/cloud/disconnect route...')
router.post('/cloud/disconnect', totemAuth.authorize, async (req, res, next) => {
  try {
    console.log('ok')

    await cloudController.unregister()

    res.json({})
  } catch (error) {
    res.status(500).send('Error to disconnect: ' + error)
  }
})

module.exports = router
