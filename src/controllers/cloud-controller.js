'use strict'

const settings = require('../../settings/' + process.env.NODE_ENV + '.json')

const storage = require('node-persist')
const axios = require('axios')

exports.status = async () => {
  return axios.get(settings.cloud + '/status').then(response => {
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
  const token = await storage.getItem('TOKEN')

  const options = {
    headers: { Authorization: 'Bearer ' + token }
  }

  return axios.get(settings.cloud + '/gateway/active', options).then(response => {
    return true
  }).catch(error => {
    console.log(error)

    return false
  })
}

exports.getFarm = async () => {
  return storage.getItem('FARM')
}

exports.register = async (farm, mac) => {
  return axios.post(settings.cloud + '/gateway/token/' + farm, { mac: mac }).then(response => {
    storage.setItem('FARM', farm)
    storage.setItem('TOKEN', response.data.token)

    return response.data.token
  }).catch(error => {
    console.log(error)

    return null
  })
}
