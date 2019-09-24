'use strict';

const express = require('express');
const router = express.Router();

const os = require('os');
const osUtils = require('os-utils');
const diskspace = require('diskspace');

router.get('/ip', (req, res, next) => {

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

  res.status(200).send(ips);
});

router.get('/system', (req, res, next) => {
  osUtils.cpuUsage((cpu) => {
    res.status(200).send({
      uptime: os.uptime(),
      memory: 100 - osUtils.freememPercentage(),
      cpu: cpu
    });
  });
});

router.get('/disk', (req, res, next) => {
  var mount = process.env.NODE_ENV != 'production' ? '/' : '/writable'

  diskspace.check(mount, (err, result) => {
    res.status(200).send(result);
  });
});

router.get('/data-by-type', (req, res, next) => {
  res.status(200).send({});
});

router.get('/data-by-day', (req, res, next) => {
  res.status(200).send({});
});

const deviceRepository = require('../repositories/device-repository');

router.get('/devices', async (req, res, next) => {
  try {
    const devices = await deviceRepository.getAll();

    if (!devices) {
      res.status(404).send({ message: 'Dipositivos não encontrados' });
      return;
    }
    res.status(200).send(devices);
  } catch (e) {
    res.status(500).send({ message: 'Falha na requisição', data: e });
  }
});

module.exports = router;
