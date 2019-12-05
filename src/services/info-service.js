'use strict'

const ipaddress = require('ip')
const isOnline = require('is-online')
const macaddress = require('macaddress')

exports.isOnline = async () => {
  return isOnline()
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
  // var ifaces = os.networkInterfaces()

  // var ips = []
const ip = ipaddress.address()

  // Object.keys(ifaces).forEach(function (ifname) {
  //   var alias = 0

  //   ifaces[ifname].forEach(function (iface) {
  //     if (iface.family === 'IPv4' && iface.internal === false) {
  //       if (alias >= 1) {
  //         // This single interface has multiple ipv4 addresses
  //         ips.push({ interface: ifname + ':' + alias, ip: iface.address })
  //       } else {
  //         // This interface has only one ipv4 adress
  //         ips.push({ interface: ifname, ip: iface.address })
  //       }
  //     }
  //     ++alias
  //   })
  // })

  // return ips
  return ip
}
