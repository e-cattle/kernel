'use strict'

const __ = require('../services/log-service')

const GeneralValidator = require('../validators/general-validator')
const SensorValidator = require('../validators/sensor-validator')

const deviceRepository = require('../repositories/device-repository')
const contractRepository = require('../repositories/contract-repository')

const deviceAuth = require('../auth/device-auth')

async function validate (device) {
  try {
    const generalValidator = new GeneralValidator()
    const sensorValidator = new SensorValidator()

    sensorValidator.validateProperties(device)

    if (!sensorValidator.isPropertiesValid()) {
      return sensorValidator.propertieErrors()
    }

    generalValidator.hasMinLen(device.name, 3, 'O nome (name) deve conter pelo menos 3 caracteres!')
    generalValidator.hasMinLen(device.description, 3, 'A descrição (description) deve conter pelo menos 3 caracteres!')
    generalValidator.hasMinLen(device.local, 3, 'A localização (local) deve conter pelo menos 3 caracteres!')
    generalValidator.isMac(device.mac, 'Mac inválido!')

    await sensorValidator.validateSensors(device.sensors)

    if (!generalValidator.isValid() || !sensorValidator.isValid()) {
      return generalValidator.errors().concat(sensorValidator.errors())
    }

    return
  } catch (err) {
    console.log(err)

    return 'Houve um erro no tratamento da requisição! Por favor, contacte o suporte.'
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
      device.delete = false
    } else {
      // Caso exista, pega a versão atual e gera uma nova
      device.name = req.body.name
      device.description = req.body.description
      device.local = req.body.local
      device.version = device.version + 1
      device.sensors = req.body.sensors
      device.changed = Date.now()
      device.delete = false
    }

    // Validação
    const errors = await validate(device)

    if (errors) {
      res.status(401).json({ message: errors })

      return
    }

    // Cadastra o Dispositivo
    const fresh = await deviceRepository.save(device)

    // Gera o Contrato
    await contractRepository.create({
      device: fresh._id,
      name: fresh.name,
      description: fresh.description,
      local: fresh.local,
      version: fresh.version,
      sensors: fresh.sensors,
      date: fresh.changed
    })

    // Geração do Token
    // Gera o token valido para o dispositivo
    const token = await deviceAuth.generateToken({
      id: fresh._id,
      name: fresh.name,
      mac: fresh.mac,
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

exports.all = async (req, res, next) => {
  try {
    const devices = await deviceRepository.getAll()

    if (!devices) {
      res.status(404).send({ message: 'Dipositivos não encontrados!' })
      return
    }

    res.status(200).send(devices)
  } catch (e) {
    res.status(500).send({ message: 'Falha na requisição!', data: e })
  }
}

exports.enable = async (req, res, next) => {
  if (!req.params.mac) {
    res.status(401).json({ message: 'MAC não fornecido!' })
    return
  }

  try {
    const mac = req.params.mac

    const device = await deviceRepository.enableByMac(mac)

    if (!device) {
      res.status(404).json({ message: 'Dipositivo não encontrado!' })

      return
    }

    res.status(200).json(device)
  } catch (e) {
    res.status(500).json({ message: 'Falha na requisição!', data: e })
  }
}

exports.disable = async (req, res, next) => {
  if (!req.params.mac) {
    res.status(401).json({ message: 'MAC não fornecido!' })
    return
  }

  try {
    const mac = req.params.mac

    const device = await deviceRepository.disableByMac(mac)

    if (!device) {
      res.status(404).json({ message: 'Dipositivo não encontrado!' })
      return
    }

    res.status(200).json(device)
  } catch (e) {
    res.status(500).json({ message: 'Falha na requisição!', data: e })
  }
}

exports.delete = async (req, res, next) => {
  __('Calling controller DELETE...')

  if (!req.params.mac) {
    res.status(401).json({ message: 'MAC não fornecido!' })
    return
  }

  try {
    const mac = req.params.mac

    const device = await deviceRepository.deleteByMac(mac)

    if (!device) {
      res.status(404).json({ message: 'Dipositivo não encontrado!' })
      return
    }

    res.status(200).json(device)
  } catch (e) {
    res.status(500).json({ message: 'Falha na requisição!', data: e })
  }
}
