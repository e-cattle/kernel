'use strict'

// const fetch = require('node-fetch')
// const axios = require('axios')

const GeneralValidator = require('../validators/general-validator')
const SensorValidator = require('../validators/sensor-validator')

const deviceRepository = require('../repositories/device-repository')
const contractRepository = require('../repositories/contract-repository')

const authService = require('../services/auth-service')
// const infoService = require('../services/info-service')

async function validate (device) {
  try {
    const generalValidator = new GeneralValidator()
    const sensorValidator = new SensorValidator()

    sensorValidator.validadeProperties(device)

    if (!sensorValidator.isPropertiesValid()) {
      return sensorValidator.propertieErrors()
    }

    generalValidator.hasMinLen(device.name, 3, 'O nome (name) deve conter pelo menos 3 caracteres!')
    generalValidator.hasMinLen(device.description, 3, 'A descrição (description) deve conter pelo menos 3 caracteres!')
    generalValidator.hasMinLen(device.local, 3, 'A localização (local) deve conter pelo menos 3 caracteres!')
    generalValidator.isMac(device.mac, 'Mac inválido!')

    sensorValidator.validadeSensors(device.sensors)

    if (!generalValidator.isValid() || !sensorValidator.isValid()) {
      return generalValidator.errors().concat(sensorValidator.errors())
    }

    return
  } catch (err) {
    return err
  }
}

// Cadastra ou Altera o Device
exports.save = async (req, res, next) => {
  try {
    // Localiza o disposito caso já exista
    let device = await deviceRepository.getByMac(req.body.mac)

    // Senao existe cria um novo
    if (!device) {
      device = req.body
      device.version = 1
      device.enable = undefined
      device.created = undefined
      device.changed = undefined
    } else {
      // Caso exista, pega a versão atual e gera uma nova
      device.name = req.body.name
      device.description = req.body.description
      device.local = req.body.local
      device.version = device.version + 1
      device.sensors = req.body.sensors
      device.changed = undefined
    }

    // Validação
    const errors = await validate(device)

    if (errors) {
      res.status(401).json({ message: errors })

      return
    }

    // Cadastra o Dispositivo
    const fresh = await deviceRepository.save(device)

    // Geração do Token
    // Gera o token valido para o dispositivo
    const token = await authService.generateToken({
      id: fresh._id,
      name: fresh.name,
      mac: fresh.mac,
      date: fresh.changed
    })

    // Gera o Contrato
    await contractRepository.create({
      device: fresh._id,
      name: fresh.name,
      description: fresh.description,
      local: fresh.local,
      mac: fresh.mac,
      version: fresh.version,
      sensors: fresh.sensors,
      date: fresh.changed
    })

    // Envia o novo token para o dispositivo
    res.status(201).send({
      token: token
    })

    return
  } catch (error) {
    res.status(500).send(error)
    throw error
  }
}

exports.getAll = async (req, res, next) => {
  try {
    const devices = await deviceRepository.getAll()
    if (!devices) {
      res.status(404).send({ message: 'Dipositivos não encontrados' })
      return
    }
    res.status(200).send(devices)
  } catch (e) {
    res.status(500).send({ message: 'Falha na requisição', data: e })
  }
}

/*
exports.syncDevices = async (req, res, next) => {
  try {
    let errors = ''
    const macaddress = await infoService.getMacAddress()
    const devices = await deviceRepository.getAllUnsynced()
    const config = await configRepository.getConfig()

    if (devices.length <= 0) res.status(200).send('Todos os dispositivos sincronizados.<br>')

    for (let i = 0; i < devices.length; i++) {
      const device = devices[i]
      device.kernelMac = macaddress
      const body = { token: config.token, device: device, kernelMac: macaddress }
      console.log(`Sincronizando dispositivo: ${device.name}`)
      const response = await axios.post(`${config.apiAddressProtocol}${config.apiAddress}devices-sync/`, body)
      if (!response.data.syncedAt) errors += `Erro ao sincronizar dispositivo: ${device.name}`
      else setSynced(device.mac)
    }

    if (errors === '') res.send({ message: 'Todos os dispositivos foram sincronizados' })
    else res.status(500).send({ errors: errors })

    return
  } catch (e) {
    res.status(500).send('Erro ao sincronizar devices')
    console.log(e)
  }
}

exports.setSynced = async (req, res, next) => {
  if (!req.params.mac) {
    res.status(401).json({ message: 'MAC não fornecido' })
  } else {
    try {
      await setSynced(req.params.mac)
      res.send('Ok')
    } catch (error) {
      res.status(500).send('Erro ao atualizar device')
    }
  }
}

async function setSynced (mac) {
  const device = await deviceRepository.setSyncedByMac(mac)

  if (!device) {
    throw new Error('Erro ao atualizar dispositivo: ' + mac)
  }

  return device
}
*/

exports.enable = async (req, res, next) => {
  if (!req.params.mac) {
    res.status(401).json({ message: 'MAC não fornecido' })
    return
  }
  try {
    const mac = req.params.mac
    const device = await deviceRepository.enableByMac(mac)
    if (!device) {
      res.status(404).json({ message: 'Dipositivo não encontrado' })
      return
    }
    res.status(200).json(device)
  } catch (e) {
    res.status(500).json({ message: 'Falha na requisição', data: e })
  }
}

exports.disable = async (req, res, next) => {
  if (!req.params.mac) {
    res.status(401).json({ message: 'MAC não fornecido' })
    return
  }
  try {
    const mac = req.params.mac
    const device = await deviceRepository.disableByMac(mac)
    if (!device) {
      res.status(404).json({ message: 'Dipositivo não encontrado' })
      return
    }
    res.status(200).json(device)
  } catch (e) {
    res.status(500).json({ message: 'Falha na requisição', data: e })
  }
}
