'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const magnetometer = new Schema({
  device: {
    type: Schema.Types.ObjectId,
    ref: 'Device',
    required: true
  },
  value: [{
    mx: {
      type: Number,
      required: true
    },
    my: {
      type: Number,
      required: true
    },
    mz: {
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
}, { collection: 'type-magnetometer' })

module.exports = mongoose.model('type-magnetometer', magnetometer)
