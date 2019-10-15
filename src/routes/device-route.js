'use strict'

const express = require('express')
const router = express.Router()
const controller = require('../controllers/device-controller')
const authService = require('../services/auth-service')

router.post('/', controller.save)
router.put('/', controller.save)
router.post('/renew', authService.renewToken)

/*
router.get('/', controller.getAll)
router.get('/sync', controller.syncDevices)
router.get('/synced/:mac', controller.setSynced)
router.get('/enable/:mac', controller.enable)
router.get('/disable/:mac', controller.disable)
router.post('/authenticate', authService.authorize)
*/

module.exports = router
