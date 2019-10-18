'use strict'

const jwt = require('jsonwebtoken')
const DeviceRepository = require('../repositories/device-repository')

// Gera o token baseado nos dados "data", junto com a chave privada process.env.PK
var generateToken = async (data) => {
  return jwt.sign(data, process.env.PK)
}

exports.generateToken = generateToken

// Retorna os dados decodificados inseridos no token
var decodeToken = async (token) => {
  var data = await jwt.verify(token, process.env.PK)
  return data
}

exports.decodeToken = decodeToken

// Valida se o token é valido
exports.authorize = async function (req, res, next) {
  const token = req.body.token || req.query.token || req.headers['x-access-token']
  const mac = req.body.mac || req.query.mac

  if (!token || !mac) {
    res.status(401).json({
      message: 'Invalid (or empty) token or MAC address!'
    })
  } else {
    jwt.verify(token, process.env.PK, function (error, decoded) {
      if (error) {
        res.status(401).json({
          message: 'Invalid token!'
        })
      } else {
        decodeToken(token).then((device) => {
          if (mac === device.mac) next()
          else {
            res.status(401).json({
              message: 'MAC address in token is not valid! ' + mac + ' != ' + device.mac
            })
          }
        }).catch((err) => {
          res.status(500).json({
            message: `Error to extract MAC inside token: ${err}`
          })
        })
      }
    })
  }
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
