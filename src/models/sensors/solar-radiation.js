'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const solarRadiation = new Schema({
  device: {
    type: Schema.Types.ObjectId,
    ref: 'Device',
    required: true
  },
  value: {
    type: Number,
    min: 0,
    max: 1500,
    validate: /^\d{0,4}?$/,
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
}, { collection: 'type-solar-radiation' })

module.exports = mongoose.model('type-solar-radiation', solarRadiation)
