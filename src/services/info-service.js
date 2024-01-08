'use strict'

const folder = process.env.SNAP_DATA ? process.env.SNAP_DATA + '/settings/' : '../../settings/'
const settings = require(folder + process.env.NODE_ENV + '.json')
const ipaddress = require('ip')
const isOnline = require('is-online')
const isReachable = require('is-reachable')
const macaddress = require('macaddress')

exports.isOnline = async () => {
  return isOnline()
}

exports.isReachable = async () => {
  return isReachable(settings.cloud)
}

exports.getMacAddress = () => {
  return new Promise((resolve, reject) => {
    macaddress.one((err, mac) => {
      if (err) {
        console.log(err)
        return null
      }

      resolve(mac)
    })
  })
}

exports.getIp = () => {
  return ipaddress.address()
}
