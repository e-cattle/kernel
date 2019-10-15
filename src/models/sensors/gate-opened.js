'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const gateOpened = new Schema({
  deviceId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  value: {
    type: Boolean,
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
  dataStorage: {
    type: Date,
    default: Date.now,
    required: true
  },
  syncedAt: {
    type: Date
  }
}, { collection: 'type-gate-opened' })

module.exports = mongoose.model('type-gate-opened', gateOpened)
