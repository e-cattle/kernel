'use strict'

const __ = require('../services/log-service')

__('Trying load routes/index-route.js')

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
    const ip = await infoService.getIp()

    resp.json({
      online: online,
      mac: mac,
      ip: ip
    })
  } catch (error) {
    resp.status(500).send('Error to get Kernel status: ' + error)
  }
})

__('All done!')

module.exports = router
