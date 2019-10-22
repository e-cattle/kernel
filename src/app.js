'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const app = express()

// Entity Models
require('./models/device')
require('./models/contract')

// Sensors Models
require('./models/sensors/accelerometer')
require('./models/sensors/air-temperature')
require('./models/sensors/animal-speed')
require('./models/sensors/animal-weight')
require('./models/sensors/black-globe-temperature')
require('./models/sensors/body-temperature')
require('./models/sensors/ch4')
require('./models/sensors/co2')
require('./models/sensors/dew-point-temperature')
require('./models/sensors/dry-bulb-temperature')
require('./models/sensors/gate-opened')
require('./models/sensors/gdop')
require('./models/sensors/geographic-coordinate')
require('./models/sensors/gyroscope')
require('./models/sensors/heart-rate')
require('./models/sensors/magnetometer')
require('./models/sensors/ph')
require('./models/sensors/precipitation')
require('./models/sensors/relative-humidity')
require('./models/sensors/respiratory-frequency')
require('./models/sensors/retal-temperature')
require('./models/sensors/soil-moisture')
require('./models/sensors/soil-nitrogen')
require('./models/sensors/soil-temperature')
require('./models/sensors/soil-water-potencial')
require('./models/sensors/solar-radiation')
require('./models/sensors/water-temperature')
require('./models/sensors/wet-bulb-temperature')
require('./models/sensors/wind-speed')

// JSON Converter
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: false
}))

// CORS
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, x-access-token, authorization')
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  next()
})

// Routes
const indexRoute = require('./routes/index-route')
const deviceRoute = require('./routes/device-route')
const measureRoute = require('./routes/measure-route')
const totemRoute = require('./routes/totem-route')

// Routes Scope

app.use('/', indexRoute)
app.use('/device', deviceRoute)
app.use('/measure', measureRoute)
app.use('/totem', totemRoute)

module.exports = app
