'use strict'

const settings = require('../../settings/' + process.env.NODE_ENV + '.json')

const storage = require('node-persist')
const axios = require('axios')

exports.status = async () => {
  return axios.get(process.env.API_CLOUD || settings.cloud + '/status').then(response => {
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
  const options = {
    headers: { Authorization: 'Bearer ' + await storage.getItem('TOKEN') }
  }

  return axios.get(process.env.API_CLOUD || settings.cloud + '/gateway/status', options).then(response => {
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
  const config = {
    headers: { Authorization: 'Bearer ' + await storage.getItem('TOKEN') }
  }

  return axios.get(process.env.API_CLOUD || settings.cloud + '/gateway/farm/synopsis', config).then(response => {
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
  return axios.post(process.env.API_CLOUD || settings.cloud + '/gateway/register', { farm: farm, mac: mac }).then(response => {
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

  return axios.post(process.env.API_CLOUD || settings.cloud + '/gateway/unregister', {}, config).then(response => {
    storage.removeItem('FARM')
    storage.removeItem('TOKEN')
  }).catch(error => {
    console.log(error)
  })
}
