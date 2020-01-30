'use strict'

const storage = require('node-persist')

exports.setToken = async (token) => {
  await storage.setItem('TEST', 'QQ COISA')
  console.log(await storage.getItem('TEST'))
}
