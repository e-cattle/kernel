'use strict'

const mongoose = require('mongoose')
const moment = require('moment')

// const SensorTypeValidator = require('../validators/sensor-validator')

const deviceRepository = require('../repositories/device-repository')
require('../repositories/contract-repository')

// require('../auth/device-auth')

exports.collect = async (req, res, next) => {
  if (!req.mac) {
    res.status(401).send({ message: 'Error to get MAC Address from token!' })
    return
  }

  console.log('MAC: ' + req.mac)

  // const sensorTypeValidator = new SensorTypeValidator()

  const device = await deviceRepository.authenticate({ mac: req.mac })

  if (!device) {
    res.status(404).send({ message: 'Invalid or disable device!' })
    return
  }

  const measures = req.body.measures

  // Verifica se tem medidas
  if (!measures) {
    res.status(404).send({ message: 'Empty measures!' })
    return
  }

  const defaultResource = req.body.resource

  let defaultDate = null

  const aux = moment(req.body.date)

  if (aux.isValid()) {
    defaultDate = aux.toDate()
  } else {
    defaultDate = Date.now()
  }

  /*
  // Verifica se os sensores das medidas são válidos
  try {
    sensorTypeValidator.validateSensors(req.body.measures)

    if (!sensorTypeValidator.isValid()) {
      res.status(400).json(sensorTypeValidator.errors())
      return
    }
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: `Invalid sensor data type: ${err}` })
  }
  */

  try {
    const errors = []
    const success = []
    const invalids = []

    // Persist measures...
    for (let i = 0; i < measures.length; i++) {
      const measure = measures[i]

      if (!measure.name || measure.name.length === 0) {
        errors.push({ measure: measure, error: 'Attribute \'name\' is required!' })

        continue
      }

      let hasSensor = false

      // Verify if measure sensor type is in contratct...
      for (let j = 0; j < device.sensors.length; j++) {
        if (device.sensors[j].name === measure.name) {
          hasSensor = true

          const Schema = mongoose.model(device.sensors[j].type)

          let date = null

          if (measure.date) {
            const aux = moment(measure.date)

            if (aux.isValid()) {
              date = aux.toDate()
            }
          }

          const newMeasure = new Schema({
            device: device._id,
            value: measure.value,
            date: date || defaultDate,
            resource: measure.resource || defaultResource
          })

          const result = await newMeasure.save()

          if (result) {
            success.push(measure)
          } else {
            errors.push({ measure: measure, error: result })
          }
        }
      }

      if (!hasSensor) {
        invalids.push(measure)
      }
    }

    if (invalids.length === 0 && errors.length === 0) {
      res.status(201).send({ message: 'All measures collected by sensors has been saved!' })
    } else {
      res.status(207).send({ sucess: success, invalid: invalids, error: errors })
    }
  } catch (err) {
    res.status(500).json({ message: `${err}` })
  }
}

/*
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
*/
