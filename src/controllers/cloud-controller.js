'use strict'

const settings = require('../../settings/' + process.env.NODE_ENV + '.json')

const storage = require('node-persist')
const axios = require('axios')
const mongoose = require('mongoose')
const { EJSON } = require('bson')
const infoService = require('../services/info-service')

exports.status = async () => {
  return axios.get((process.env.API_CLOUD || settings.cloud) + '/status').then(response => {
    return true
  }).catch(error => {
    console.log(error)

    return false
  })
}

exports.isRegistered = async () => {
  const farm = await storage.getItem('FARM')
  const token = await storage.getItem('TOKEN')

  if (farm && !isNaN(farm) && farm.trim() !== '' && token && typeof token === 'string' && token.trim() !== '') {
    return true
  } else {
    return false
  }
}

exports.isActive = async () => {
  const axiosInstance = axios.create({
    headers: {
      Authorization: 'Bearer ' + await storage.getItem('TOKEN')
    }
  })

  const code = await storage.getItem('FARM')
  const mac = await infoService.getMacAddress()

  return axiosInstance.get((process.env.API_CLOUD || settings.cloud) + '/gateway/status', { params: { mac, code } }).then(response => {
    return response.data
  }).catch(error => {
    console.log(error)

    return {
      active: false,
      approve: false
    }
  })
}

exports.getFarmId = async () => {
  return storage.getItem('FARM')
}

exports.getFarm = async () => {
  const axiosInstance = axios.create({
    headers: {
      Authorization: 'Bearer ' + await storage.getItem('TOKEN')
    }
  })

  const code = await storage.getItem('FARM')
  const mac = await infoService.getMacAddress()

  return axiosInstance.get((process.env.API_CLOUD || settings.cloud) + '/gateway/farm/synopsis', { params: { mac, code } }).then(response => {
    return {
      name: response.data.name,
      location: response.data.location,
      country: response.data.country
    }
  }).catch(error => {
    console.log(error)

    return null
  })
}

exports.register = async (farm, mac) => {
  return axios.post((process.env.API_CLOUD || settings.cloud) + '/gateway/register', { farm: farm, mac: mac }).then(response => {
    storage.setItem('FARM', farm)
    storage.setItem('TOKEN', response.data.token)

    return response.data.token
  }).catch(error => {
    console.log(error)

    return null
  })
}

exports.unregister = async () => {
  const config = {
    headers: { Authorization: 'Bearer ' + await storage.getItem('TOKEN') }
  }

  const code = await storage.getItem('FARM')
  const mac = await infoService.getMacAddress()

  return axios.post((process.env.API_CLOUD || settings.cloud) + '/gateway/unregister', { code, mac }, config).then(response => {
    storage.removeItem('FARM')
    storage.removeItem('TOKEN')
  }).catch(error => {
    console.log(error)
  })
}
exports.syncContract = async (req, res) => {
  console.log(req.body.sensors)
  try {
    const Contract = mongoose.model('Contract')
    const contracts = EJSON.parse(req.body.data)

    let notSynced = new Array()
    let synced = new Array()
    for (const contract of contracts) {
      if (!contract.sensors) {
        notSynced.push({ contract, error: 'Contratos não fornecidos' })
        continue
      }
      await Contract.findOneAndUpdate({ _id: contract._id }, contract, function (error) {
        if (error)
          notSynced.push({ contract, error })
        else
          synced.push(contract)
      })
    }
    if (notSynced.length === 0)
      res.status(200).json({ message: 'Dados sincronizados com sucesso' })
    else if (synced.length > 0)
      res.status(207).json({ message: 'Dados parcialmente sincronizados', data: { synced, notSynced } })
    else
      res.status(400).json({ message: 'Falha ao salvar contratos', data: notSynced })
  } catch (e) {
    res.status(500).json({ message: 'Falha na requisição', data: e })
  }
}

exports.syncDevice = async (req, res) => {
  try {
    const Device = mongoose.model('Device')
    const devices = EJSON.parse(req.body.data)

    let notSynced = new Array()
    let synced = new Array()
    for (const device of devices) {
      if (!device.sensors) {
        notSynced.push({ device, error: 'Sensores não fornecidos' })
      }
      await Device.findOneAndUpdate({ _id: device._id }, device, function (error) {
        if (error)
          notSynced.push({ device, error })
        else
          synced.push(device)
      })
    }
    if (notSynced.length === 0)
      res.status(200).json({ message: 'Dados sincronizados com sucesso' })
    else if (synced.length > 0)
      res.status(207).json({ message: 'Dados parcialmente sincronizados', data: { synced, notSynced } })
    else
      res.status(400).json({ message: 'Falha ao salvar contratos', data: notSynced })
  } catch (e) {
    res.status(500).json({ message: 'Falha na requisição', data: e })
  }
}

exports.syncSensor = async (req, res) => {
  if (!req.body.data) {
    res.status(401).json({ message: 'Dados do sensor não fornecido' })
    return
  }
  try {
    const sensor = EJSON.parse(req.body.data)
    const type = req.body.type
    const Sensor = mongoose.model(type)
    await Sensor.findOneAndUpdate({ _id: sensor._id }, sensor, function (error) {
      if (error)
        res.status(400).json({ message: 'Falha ao salvar dados sensoriais', data: error })
      else
        res.status(200).json({ message: 'Dados atualizados com sucesso' })
    })
  } catch (e) {
    console.log(e)
    res.status(500).json({ message: 'Falha na requisição', data: e })
  }
}
