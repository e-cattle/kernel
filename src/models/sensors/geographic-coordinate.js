'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const geographicCoordinate = new Schema({
  device: {
    type: Schema.Types.ObjectId,
    ref: 'Device',
    required: true
  },
  value: [{
    altitude: {
      type: Number,
      required: false
    },
    latitude: {
      type: Number,
      min: -90,
      max: 90,
      validate: /^-?\d{0,2}(\.\d{1,6})?$/,
      required: false
    },
    longitude: {
      type: Number,
      min: -180,
      max: 180,
      validate: /^-?\d{0,3}(\.\d{1,6})?$/,
      required: false
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
}, { collection: 'type-geographic-coordinate' })

module.exports = mongoose.model('type-geographic-coordinate', geographicCoordinate)
