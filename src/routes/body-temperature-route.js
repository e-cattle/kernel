'use strict';

const express = require('express');
const router = express.Router();
const controller = require('../controllers/body-temperature-controller');
const authService = require('../services/auth-service');

router.post('/', authService.authorize,  controller.create);
router.get('/', controller.getAll);
router.post('/refresh-token', authService.authorize, controller.refreshToken);

module.exports = router;