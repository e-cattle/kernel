'use strict'

const jwt = require('jsonwebtoken')

exports.authorize = async function (req, res, next) {
  let token = req.headers.authorization

  if (!token) {
    res.status(401).json({
      message: 'Invalid (or empty) token!'
    })

    return
  }

  token = token.replace('Bearer ', '')

  await jwt.verify(token, process.env.TOTEM_PK, function (error, decoded) {
    if (error) {
      res.status(401).json({
        message: 'Invalid token!'
      })

      return
    }

    next()
  })
}

exports.token = async function (req, res) {
  const ip = req.connection.remoteAddress

  if (['::1', '127.0.0.1', '0.0.0.0', '::ffff:127.0.0.1'].indexOf(ip) < 0 && process.env.NODE_ENV === 'production') {
    res.status(401).json({
      message: 'Accessible only via localhost! Your IP is \'' + ip + '\'.'
    })

    return
  }

  var token = await jwt.sign({
    date: new Date().toISOString()
  }, process.env.TOTEM_PK)

  res.json({ token: token })
}
