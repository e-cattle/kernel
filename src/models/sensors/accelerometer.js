'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const accelerometer = new Schema({
  device: {
    type: Schema.Types.ObjectId,
    ref: 'Device',
    required: true
  },
  value: [{
    ax: {
      type: Number,
      required: true
    },
    ay: {
      type: Number,
      required: true
    },
    az: {
      type: Number,
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
}, { collection: 'type-accelerometer' })

module.exports = mongoose.model('type-accelerometer', accelerometer)
