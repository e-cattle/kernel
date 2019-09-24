'use strict';

const express = require('express');
const router = express.Router();

const pkg = require('../../package.json');

router.get('/', (req, res, next) => {
  res.status(200).send({
    name: pkg.name,
    description: pkg.description,
    contributors: pkg.contributors,
    version: pkg.version
  });
});

module.exports = router;
