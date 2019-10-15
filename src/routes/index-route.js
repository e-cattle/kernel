'use strict'

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
    console.log(error)
    resp.status(500).send('Erro ao verificar o status do Kernel!')
  }
})

module.exports = router
