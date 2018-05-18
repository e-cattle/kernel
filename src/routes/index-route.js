'use strict';

const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200).send({
        title: "e-Cattle Sensor API",
        version: "1.18.09"
    });
});

module.exports = router;