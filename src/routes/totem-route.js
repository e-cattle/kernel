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
    diskspace.check('/', (err, result) => {
        res.status(200).send(result);
    });
});

module.exports = router;