'use strict';

//ROUTERS apenas dos Device
const express = require('express');
const router = express.Router();
const infoService = require('./../services/info-service');
const configRepository = require('../repositories/config-repository');

router.get('/is-online', async (req, resp) => {
    try {
        let online = await infoService.isOnline();
        resp.json({ isOnline: online });
    } catch (error) {
        console.log(error);
        resp.status(500).send("Erro ao verificar se o kernel está online");
    }
});

router.get('/macaddress', async (req, resp) => {
    try {
        let mac = await infoService.getMacAddress();
        resp.json({ mac: mac });
    } catch (error) {
        console.log(error);
        resp.status(500).send("Erro ao consultar MAC do kernel");
    }
});

router.get('/config', async (req, resp) => {
    try {
        let config = await configRepository.getConfig();
        let err = config ? null : 'Não há configuração cadastrada';
        resp.json({ err: err, config: config||null });
    } catch (error) {
        console.log(error);
        resp.status(500).send("Erro ao buscar configurações do kernel");
    }
});

router.post('/config', async (req, resp) => {
    try {
        if(req.body.apiAddress && req.body.apiAddress.lastIndexOf("/") <= 0) req.body.apiAddress += "/"; // Concatena o caracter "/" no final da string, caso não haja
        let result = await configRepository.save(req.body);
        resp.json({ msg: "Configuração salva com sucesso!", kernel: result});
    } catch (error) {
        console.log(error);
        resp.status(500).send("Erro ao salvar configurações do kernel");
    }
});

module.exports = router;