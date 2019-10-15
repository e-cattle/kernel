'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const bodyTemperature = new Schema({
  deviceId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  value: {
    type: Number,
    min: 20,
    max: 50,
    validate: /^\d{0,2}(\.\d{1,2})?$/,
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
}, { collection: 'type-body-temperature' })

module.exports = mongoose.model('type-body-temperature', bodyTemperature)
