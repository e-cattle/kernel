'use strict'

const jwt = require('jsonwebtoken')
const mid = require('machine-id')

const infoService = require('../services/info-service')

exports.authorize = async function (req, res, next) {
  let token = req.headers.authorization

  if (!token) {
    res.status(401).json({
      message: 'Invalid (or empty) token!'
    })

    return
  }

  token = token.replace('Bearer ', '')

  const mac = await infoService.getMacAddress()

  await jwt.verify(token, mid(), function (error, decoded) {
    console.log('Machine ID: ' + mid())

    if (error) {
      res.status(401).json({
        message: 'Invalid token!'
      })

      return
    }

    if (mac !== decoded.mac) {
      console.log(mac + ' != ' + decoded.mac)

      res.status(401).json({
        message: 'Invalid MAC Address inside token!'
      })

      return
    }

    next()
  })
}
