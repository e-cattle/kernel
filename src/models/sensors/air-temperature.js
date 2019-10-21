'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const airTemperature = new Schema({
  device: {
    type: Schema.Types.ObjectId,
    ref: 'Device',
    required: true
  },
  value: {
    type: Number,
    min: -99,
    max: 1999,
    validate: /^-?\d{0,4}(\.\d{1,2})?$/,
    required: true
  },
  date: {
    type: Date,
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
}, { collection: 'type-air-temperature' })

module.exports = mongoose.model('type-air-temperature', airTemperature)
