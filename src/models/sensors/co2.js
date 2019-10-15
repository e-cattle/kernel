'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const co2 = new Schema({
  deviceId: {
    type: Schema.Types.ObjectId,
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
  dataStorage: {
    type: Date,
    default: Date.now,
    required: true
  },
  syncedAt: {
    type: Date
  }
}, { collection: 'type-co2' })

module.exports = mongoose.model('type-co2', co2)
