'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const gdop = new Schema({
  device: {
    type: Schema.Types.ObjectId,
    ref: 'Device',
    required: true
  },
  value: [{
    hdop: {
      type: Number,
      min: 0,
      max: 50,
      validate: /^\d{0,2}(\.\d{1,2})?$/,
      required: true
    },
    vdop: {
      type: Number,
      min: 0,
      max: 50,
      validate: /^\d{0,2}(\.\d{1,2})?$/,
      required: true
    },
    pdop: {
      type: Number,
      min: 0,
      max: 50,
      validate: /^\d{0,2}(\.\d{1,2})?$/,
      required: true
    },
    tdop: {
      type: Number,
      min: 0,
      max: 50,
      validate: /^\d{0,2}(\.\d{1,2})?$/,
      required: true
    }
  }],
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
}, { collection: 'type-gdop' })

module.exports = mongoose.model('type-gdop', gdop)
