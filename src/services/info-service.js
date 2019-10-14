'use strict';

const isOnline = require('is-online');
const macaddress = require('macaddress');
const os = require('os');

exports.isOnline = async () => {
  return await isOnline();
}

exports.getMacAddress = () => {
  return new Promise((resolve, reject) => {
    macaddress.one((err, mac) => {
      resolve(mac);
    });
  });
}

exports.getIp = () => {
  var ifaces = os.networkInterfaces();

  var ips = [];

  Object.keys(ifaces).forEach(function (ifname) {
    var alias = 0;

    ifaces[ifname].forEach(function (iface) {
      if ('IPv4' === iface.family && iface.internal === false) {
        if (alias >= 1) {
          // this single interface has multiple ipv4 addresses
          ips.push({ interface: ifname + ':' + alias, ip: iface.address });
        } else {
          // this interface has only one ipv4 adress
          ips.push({ interface: ifname, ip: iface.address });
        }
      }
      ++alias;
    });
  });

  return ips;
}
