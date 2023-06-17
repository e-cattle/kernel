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

  await jwt.verify(token, `${req.body.mac}${req.body.code}`, function (error, decoded) {
    if (error) {
      res.status(401).json({
        message: 'Invalid token!'
      })

      return
    }

    req.code = decoded.code

    next()
  })
}
/*
  exports.generateToken = async (data) => {
    return jwt.sign(data, MAC+CODE)
  }
*/