'use strict';

//ROUTERS apenas dos Device
const express = require('express');
const router = express.Router();
const configRepository = require('../repositories/config-repository');

router.get('/', async (req, resp) => {
    try {
        let config = await configRepository.getConfig();
        resp.json({ config: config });
    } catch (error) {
        console.log(error);
        resp.status(500).send("Erro ao buscar configurações do kernel");
    }
});

module.exports = router;