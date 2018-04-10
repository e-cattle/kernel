'use strict';

//ROUTERS apenas dos Device
const express = require('express');
const router = express.Router();
const controller = require('../controllers/device-controller');
const authService = require('../services/auth-service');

router.post('/', controller.save);
router.put('/', controller.save);
router.get('/', controller.getAll);
router.get('/sync', controller.getAllUnsynced);
router.get('/synced/:mac', controller.setSynced);
router.get('/enable/:mac', controller.enable);
router.get('/disable/:mac', controller.disable);
router.post('/authenticate', authService.authorize);
router.post('/renew-token', authService.renewToken);

module.exports = router;