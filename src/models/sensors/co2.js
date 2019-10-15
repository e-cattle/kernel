'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const co2 = new Schema({
  device: {
    type: Schema.Types.ObjectId,
    ref: 'Device',
    required: true
  },
  value: {
    type: Number,
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
}, { collection: 'type-co2' })

module.exports = mongoose.model('type-co2', co2)
