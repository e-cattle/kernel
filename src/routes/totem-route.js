'use strict';

const express = require('express');
const router = express.Router();

const os = require('os');
const osUtils = require('os-utils');
const diskspace = require('diskspace');

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
