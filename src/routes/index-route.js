'use strict'

const __ = require('../services/log-service')

__('Trying load routes/index-route.js')

__('Trying to load Machine ID library...')

const mid = require('machine-id')

__('Machine ID library loaded!')

const express = require('express')
const router = express.Router()

const infoService = require('../services/info-service')

const pkg = require('../../package.json')

__('Registering GET / route...')

router.get('/', (req, res, next) => {
  res.status(200).send({
    name: pkg.name,
    description: pkg.description,
    contributors: pkg.contributors,
    version: pkg.version
  })
})

__('Registering GET /status route...')

router.get('/status', async (req, resp) => {
  try {
    const online = await infoService.isOnline()
    const mac = await infoService.getMacAddress()
    const ips = await infoService.getIp()

    resp.json({
      online: online,
      mac: mac,
      ips: ips
    })
  } catch (error) {
    resp.status(500).send('Error to get Kernel status: ' + error)
  }
})

__('Registering GET /id route...')

router.get('/id', async (req, resp) => {
  try {
    const ip = req.connection.remoteAddress

    if (['::1', '127.0.0.1', '0.0.0.0'].indexOf(ip) < 0) {
      resp.status(401).send('Accessible only via localhost! Your IP is \'' + ip + '\'.')

      return
    }

    resp.json({
      id: mid()
    })
  } catch (error) {
    resp.status(500).send('Error to get Machine ID: ' + error)
  }
})

__('All done!')

module.exports = router
