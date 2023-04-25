'use strict'

const settings = require('../../settings/' + process.env.NODE_ENV + '.json')

const storage = require('node-persist')
const axios = require('axios')
const jwt = require('jwt-simple')

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


exports.syncContract = async (req, res, next) => {
  const payloadDecoded = await jwt.verify(req.headers.authorization.replace('Bearer ', ''), req.body.mac + process.env.CODE_FARM, function (error, decoded) {
    if (error) {
      res.status(401).json({
        message: 'Invalid token!'
      })
      return
    }
  })

    
  if (!req.body.sensors) {
    res.status(401).json({ message: 'Sensores não fornecidos' })
    return
  }
  try {
    const Contract = mongoose.model('Contract')
    const contracts = req.body.data
    let notSynced = new Array()
    let synced = new Array()
    for (const contract of contracts) {
      await Contract.findOneAndUpdate({ _id: contract._id }, contract, function (error) {
        if (error)
          notSynced.push({ contract, error})
        else
          synced.push(contract)
      })
    }
    if (notSynced.length == 0)
      res.status(200).json({ message: 'Dados sincronizados com sucesso' })
    else if (synced.length > 0) {
      res.status(207).json({ message: 'Dados parcialmente sincronizados', data: { synced, notSynced } })    
    } else
      res.status(400).json({ message: 'Falha ao salvar contratos', data: notSynced })  
  } catch (e) {
    res.status(500).json({ message: 'Falha na requisição', data: e })
  }
}


//Criar endpoint pros dados que vai vir no type: 'TIPO_SENSOR' e data com o dado de uma medida
exports.syncSensor = async (req, res, next) => {
  const payloadDecoded = await jwt.verify(req.headers.authorization.replace('Bearer ', ''), req.body.mac + process.env.CODE_FARM, function (error, decoded) {
    if (error) {
      res.status(401).json({
        message: 'Invalid token!'
      })
      return
    }
  })


  if (!req.body.data) {
    res.status(401).json({ message: 'Dados do sensor não fornecido' })
    return
  }
  try {
    const Sensor = mongoose.model(type)  
    const sensor = req.body.data
    const type = req.body.type
    await Sensor.findOneAndUpdate({ _id: sensor._id }, sensor, function (error) {
      if(error) 
        res.status(400).json({ message: 'Falha ao salvar dados sensoriais', data: error })
      else
        res.status(200).json({ message: 'Dados atualizados com sucesso' })
    })
  } catch (e) {
    res.status(500).json({ message: 'Falha na requisição', data: e })
  }
}
