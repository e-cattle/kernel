'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const dewPointTemperature = new Schema({
  device: {
    type: Schema.Types.ObjectId,
    ref: 'Device',
    required: true
  },
  value: {
    type: Number,
    min: -50,
    max: 100,
    validate: /^-?\d{0,3}(\.\d{1,2})?$/,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  resource: {
    type: String,
    required: false
  },
  storaged: {
    type: Date,
    default: Date.now()
  }
}, { collection: 'type-dew-point-temperature' })

module.exports = mongoose.model('type-dew-point-temperature', dewPointTemperature)
