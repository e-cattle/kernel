'use strict'

// ROUTERS apenas dos Device
const express = require('express')
const router = express.Router()
const configRepository = require('../repositories/config-repository')

router.get('/config', async (req, resp) => {
  try {
    const config = await configRepository.getConfig()
    const err = config ? null : 'Não há configuração cadastrada'
    resp.json({ err: err, config: config || null })
  } catch (error) {
    console.log(error)
    resp.status(500).send('Erro ao buscar configurações do kernel')
  }
})

router.post('/config', async (req, resp) => {
  try {
    if (req.body.apiAddress && req.body.apiAddress.lastIndexOf('/') <= 0) req.body.apiAddress += '/' // Concatena o caracter '/' no final da string, caso não haja
    const result = await configRepository.save(req.body)
    resp.json({ msg: 'Configuração salva com sucesso!', kernel: result })
  } catch (error) {
    console.log(error)
    resp.status(500).send('Erro ao salvar configurações do kernel')
  }
})

module.exports = router
