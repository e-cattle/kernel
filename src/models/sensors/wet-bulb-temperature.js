'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const wetBulbTemperature = new Schema({
  device: {
    type: Schema.Types.ObjectId,
    ref: 'Device',
    required: true
  },
  value: {
    type: Number,
    min: 0,
    max: 40,
    validate: /^\d{0,2}(\.\d{1,2})?$/,
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
}, { collection: 'type-wet-bulb-temperature' })

module.exports = mongoose.model('type-wet-bulb-temperature', wetBulbTemperature)
