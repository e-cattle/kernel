'use strict'

const jwt = require('jsonwebtoken')

const DeviceRepository = require('../repositories/device-repository')

// Gera o token baseado nos dados "data", utilizando o Machine ID como chave privada
var generateToken = async (data) => {
  return jwt.sign(data, process.env.DEVICE_PK)
}

exports.generateToken = generateToken

// Valida se o token é valido
exports.authorize = async function (req, res, next) {
  let token = req.body.token || req.query.token || req.headers['x-access-token'] || req.headers.authorization

  if (!token) {
    res.status(401).json({
      message: 'Invalid (or empty) token!'
    })

    return
  }

  token = token.replace('Bearer ', '')

  await jwt.verify(token, process.env.DEVICE_PK, function (error, decoded) {
    if (error) {
      res.status(401).json({
        message: 'Invalid token!'
      })

      return
    }

    req.mac = decoded.mac

    next()
  })
}

/*
Renova o token é de um device cadastrado e ativo, quando o token
estiver expirado
*/
exports.renewToken = async function (req, res) {
  var mac = req.body.mac

  if (!mac) {
    res.status(401).json({
      message: 'You must inform MAC address in request!'
    })

    return
  }

  var device = await DeviceRepository.getByMacEnabled(mac)

  if (!device) {
    res.status(401).json({
      message: 'Device not found or disabled!'
    })

    return
  }

  var token = await generateToken({
    id: device._id,
    name: device.name,
    mac: device.mac,
    date: device.changed
  })

  res.json({ token: token })
}
