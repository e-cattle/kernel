'use strict'

const mongoose = require('mongoose')

const SensorTypeValidator = require('../validators/sensor-validator')

const deviceRepository = require('../repositories/device-repository')
require('../repositories/contract-repository')

require('../services/auth-service')

exports.create = async (req, res, next) => {
  const sensorTypeValidator = new SensorTypeValidator()

  // Le o mac do dispositivo e valida se existe
  const device = await deviceRepository.authenticate({ mac: req.body.mac })

  // Envia mensagem de erro se não encontrar dispositivo
  if (!device) {
    res.status(404).send({ message: 'Dispositivo Inválido ou Bloqueado' })
    return
  }

  const measures = req.body.measures

  // Verifica se tem medidas
  if (!measures) {
    res.status(404).send({ message: 'É necessário informar os dados sensoriais' })
    return
  }

  // Verifica se os sensores das medidas são válidos
  try {
    sensorTypeValidator.validadeSensors(req.body.measures)

    if (!sensorTypeValidator.isValid()) {
      res.status(400).json(sensorTypeValidator.errors())
      return
    }
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: `Erro na validação dos dados sensoriais: ${err}` })
  }

  try {
    const sensorsError = []
    const sensorsValid = []
    const sensorsNoValid = []

    // Salva os dados sensoriais
    for (let i = 0; i < measures.length; i++) {
      const sensor = measures[i]
      const sensorsContract = device.sensors
      const deviceId = device._id

      let hasSensor = false

      // Verifica se existe o sensor no contrato
      for (let j = 0; j < sensorsContract.length; j++) {
        if (sensorsContract[j].name === sensor.name) {
          hasSensor = true

          // var guid = require('crypto').randomBytes(30).toString('base64')
          sensor.datas = { deviceId: deviceId, value: sensor.value, date: sensor.date, resource: sensor.resource }

          const Schema = mongoose.model(sensorsContract[j].type)
          const newMeasure = new Schema(sensor.datas)
          const savedMeasure = await newMeasure.save()

          if (savedMeasure) {
            sensorsValid.push(sensorsContract[j].type)
          } else {
            sensorsError.push(savedMeasure)
          }
        }
      }

      if (!hasSensor) {
        sensorsNoValid.push(sensor.name)
      }
    }

    if (sensorsNoValid.length === 0 && sensorsError === 0) {
      res.status(201).send({ message: 'Todos os dados sensoriais foram salvos com sucesso' })
    } else {
      res.status(500).send({ sucess: sensorsValid, notfound: sensorsNoValid, erros: sensorsError })
    }
  } catch (err) {
    res.status(500).json({ message: `${err}` })
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

exports.getAllUnsynced = async (req, res, next) => {
  const sensorTypeValidator = new SensorTypeValidator()
  const sensors = []
  try {
    const sensorsName = await sensorTypeValidator.getTypeSensors()
    for (let i = 0; i < sensorsName.length; i++) {
      const sensorName = sensorsName[i]
      const Schema = mongoose.model(sensorName)
      const sensor = { name: sensorName, measures: [] }
      sensor.measures = await Schema.find({ syncedAt: undefined })
      sensors.push(sensor)
    }
    res.json(sensors)
  } catch (err) {
    res.status(500).send({ message: 'Falha na requisição', data: err })
    throw err
  }
}

exports.setSynced = async (req, res, next) => {
  if (!req.body.sensors) {
    res.status(401).json({ message: 'Sensores atualizados não fornecidos' })
    return
  }
  try {
    const sensors = req.body.sensors
    for (let i = 0; i < sensors.length; i++) {
      const sensor = sensors[i]
      const Schema = mongoose.model(sensor.name)
      for (let i = 0; i < sensor.measures.length; i++) {
        const measure = sensor.measures[i]
        await Schema.findByIdAndUpdate(measure._id, { syncedAt: new Date() })
      }
    }
    res.json({ message: 'Dados atualizados com sucesso' })
  } catch (e) {
    res.status(500).json({ message: 'Falha na requisição', data: e })
  }
}
