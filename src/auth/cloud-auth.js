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

  await jwt.verify(token, `${process.env.JWT_SECRET}${process.env.CODE_FARM}`, function (error, decoded) {
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
