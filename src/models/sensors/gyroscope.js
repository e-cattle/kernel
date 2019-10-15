'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const gyroscope = new Schema({
  device: {
    type: Schema.Types.ObjectId,
    ref: 'Device',
    required: true
  },
  value: [{
    gx: {
      type: Number,
      required: true
    },
    gy: {
      type: Number,
      required: true
    },
    gz: {
      type: Number,
      required: true
    }
  }],
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
}, { collection: 'type-gyroscope' })

module.exports = mongoose.model('type-gyroscope', gyroscope)
