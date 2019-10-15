'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const heartRate = new Schema({
  device: {
    type: Schema.Types.ObjectId,
    ref: 'Device',
    required: true
  },
  value: {
    type: Number,
    min: 0,
    max: 100,
    validate: /^\d{0,3}?$/,
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
}, { collection: 'type-heart-rate' })

module.exports = mongoose.model('type-heart-rate', heartRate)
