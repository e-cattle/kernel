'use strict'

let errors = []
let propertieErrors = []

function SensorValidator () {
  errors = []
  propertieErrors = []
}

async function getTypeSensors () {
  // Importando mongoose
  var mongoose = require('mongoose')

  // Lendo todas as collections criadas pelo mongoose
  var collections = mongoose.connections[0].collections
  var names = []

  // Filtrando as collection em array com as collection que iniciam com o
  // prefixo 'type-'
  for (let i = 0; i < Object.keys(collections).length; i++) {
    const e = Object.keys(collections)[i]

    if (e.indexOf('type-') === 0) {
      names.push(e)
    }
  }

  return names
}

SensorValidator.prototype.getTypeSensors = getTypeSensors

SensorValidator.prototype.validateSensors = async (sensors) => {
  const validCollections = await getTypeSensors()

  // Validar o vetor de sensores vindo no json requestm(Sensor Type)
  for (let index = 0; index < sensors.length; index++) {
    const sensor = sensors[index]

    // Valida se o Json tem os sensores validos (função contains)
    let found = false
    for (let i = 0; i < validCollections.length; i++) {
      if (sensor.type === validCollections[i]) {
        found = true
        break
      }
    }

    // Resposta quando não encontra ou dá algum erro
    if (!found) {
      // Resposta quando não encontra o tipo informado na coleção valida
      errors.push({
        message: `Sensor Type inválido: ${sensor.type}`,
        name: 'ValidatorError'
      })
    }
  }
}

SensorValidator.prototype.validateProperties = (obj) => {
  /*
  if (!('name' in obj)) {
    propertieErrors.push({
      message: 'Propriedade name não encontrada',
      name: 'PropertiesError'
    })
  }
  if (!('description' in obj)) {
    propertieErrors.push({
      message: 'Propriedade description não encontrada',
      name: 'PropertiesError'
    })
  }
  if (!('branch' in obj)) {
    propertieErrors.push({
      message: 'Propriedade branch não encontrada',
      name: 'PropertiesError'
    })
  }
  if (!('model' in obj)) {
    propertieErrors.push({
      message: 'Propriedade model não encontrada',
      name: 'PropertiesError'
    })
  }
  if (!('mac' in obj)) {
    propertieErrors.push({
      message: 'Propriedade mac não encontrada',
      name: 'PropertiesError'
    })
  }
  */

  if (!('sensors' in obj)) {
    propertieErrors.push({
      message: 'Propriedade sensors não encontrada',
      name: 'PropertiesError'
    })
  } else {
    for (let i = 0; i < obj.sensors.length; i++) {
      const sensor = obj.sensors[i]
      if (!('type' in sensor)) {
        propertieErrors.push({
          message: `Propriedade type não encontrada na coleção sensors[${i}]`,
          name: 'PropertiesError'
        })
      }
      if (!('description' in sensor)) {
        propertieErrors.push({
          message: `Propriedade descriptor não encontrada na coleção sensors[${i}]`,
          name: 'PropertiesError'
        })
      }
      if (!('name' in sensor)) {
        propertieErrors.push({
          message: `Propriedade name não encontrada na coleção sensors[${i}]`,
          name: 'PropertiesError'
        })
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
