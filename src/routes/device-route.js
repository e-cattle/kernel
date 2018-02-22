'use strict';

const express = require('express');
const router = express.Router();
const controller = require('../controllers/device-controller');
const authService = require('../services/auth-service');

router.post('/', controller.create);
router.get('/', controller.getAll);
router.post('/authenticate', controller.authenticate);
router.post('/refresh-token', authService.authorize, controller.refreshToken);


module.exports = router;