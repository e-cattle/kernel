'use strict'

const mid = require('machine-id')

const express = require('express')
const router = express.Router()

const infoService = require('../services/info-service')

const pkg = require('../../package.json')

router.get('/', (req, res, next) => {
  res.status(200).send({
    name: pkg.name,
    description: pkg.description,
    contributors: pkg.contributors,
    version: pkg.version
  })
})

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

module.exports = router
