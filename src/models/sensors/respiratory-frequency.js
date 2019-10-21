'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const respiratoryFrequency = new Schema({
  device: {
    type: Schema.Types.ObjectId,
    ref: 'Device',
    required: true
  },
  value: {
    type: Number,
    min: 0,
    max: 200,
    validate: /^\d{0,3}?$/,
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
}, { collection: 'type-respiratory-frequency' })

module.exports = mongoose.model('type-respiratory-frequency', respiratoryFrequency)
