'use strict';

const express = require('express');
const router = express.Router();
const controller = require('../controllers/measure-controller');
const authService = require('../services/auth-service');

router.post('/', authService.authorize, controller.create);
router.get('/', controller.getAll);
router.get('/sync', controller.getAllUnsynced);
router.post('/synced', controller.setSynced);

module.exports = router;