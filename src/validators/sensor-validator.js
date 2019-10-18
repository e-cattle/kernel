'use strict'

let errors = []
let propertieErrors = []

function SensorValidator () {
  errors = []
  propertieErrors = []
}

async function getSensorTypes () {
  var mongoose = require('mongoose')

  // Reading all Mongoose collections...
  var collections = mongoose.connections[0].collections
  var names = []

  // Filtering collections with 'type' prefix...
  for (let i = 0; i < Object.keys(collections).length; i++) {
    const e = Object.keys(collections)[i]

    if (e.indexOf('type-') === 0) {
      names.push(e)
    }
  }

  return names
}

SensorValidator.prototype.getTypeSensors = getSensorTypes

SensorValidator.prototype.validateSensors = async (sensors) => {
  const validCollections = await getSensorTypes()

  const unique = []

  // Validate sensors array in JSON of request body...
  for (let i = 0; i < sensors.length; i++) {
    if (!validCollections.includes(sensors[i].type)) {
      errors.push({
        message: `Invalid sensor type '${sensors[i].type}'!`,
        name: 'ValidatorError'
      })
    }

    if (unique.includes(sensors[i].name)) {
      errors.push({
        message: `Sensor name must be unique but found duplicate declaration of '${sensors[i].name}'!`,
        name: 'ValidatorError'
      })
    } else {
      unique.push(sensors[i].name)
    }
  }
}

SensorValidator.prototype.validateProperties = (obj) => {
  let properties = ['name', 'description', 'branch', 'model', 'mac']

  for (let i = 0; i < properties.length; i++) {
    if (!(properties[i] in obj)) {
      propertieErrors.push({
        message: `Required field '${properties[i]}' not found!`,
        name: 'PropertiesError'
      })
    }
  }

  if (!('sensors' in obj)) {
    propertieErrors.push({
      message: 'Required field \'sensors\' not found!',
      name: 'PropertiesError'
    })
  } else {
    properties = ['type', 'description', 'name']

    for (let i = 0; i < obj.sensors.length; i++) {
      for (let j = 0; j < properties.length; j++) {
        if (!(properties[j] in obj.sensors[i])) {
          propertieErrors.push({
            message: `Required field '${properties[j]}' not found in one of sensors!`,
            name: 'PropertiesError'
          })
        }
      }
    }
  }
}

SensorValidator.prototype.errors = () => {
  return errors
}

SensorValidator.prototype.propertieErrors = () => {
  return propertieErrors
}

SensorValidator.prototype.clear = () => {
  errors = []
  propertieErrors = []
}

SensorValidator.prototype.isValid = () => {
  return errors.length === 0
}

SensorValidator.prototype.isPropertiesValid = () => {
  return propertieErrors.length === 0
}

module.exports = SensorValidator
