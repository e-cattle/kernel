'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const gateOpened = new Schema({
  device: {
    type: Schema.Types.ObjectId,
    ref: 'Device',
    required: true
  },
  value: {
    type: Boolean,
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
}, { collection: 'type-gate-opened' })

module.exports = mongoose.model('type-gate-opened', gateOpened)
