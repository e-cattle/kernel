'use strict';

//ROUTERS apenas dos Device
const express = require('express');
const router = express.Router();
const isOnline = require('is-online');
const macaddress = require('macaddress');

router.get('/is-online', (req, resp) => {
    isOnline().then(online => {
        resp.json({ isOnline: online });
    });
});

router.get('/macaddress', (req, resp) => {
    macaddress.one(function (err, mac) {
        resp.json({ mac: mac });
    });
});

module.exports = router;