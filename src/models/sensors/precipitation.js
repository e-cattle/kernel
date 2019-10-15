'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const precipitation = new Schema({
  device: {
    type: Schema.Types.ObjectId,
    ref: 'Device',
    required: true
  },
  value: {
    type: Number,
    min: 0,
    validate: /^\d+?$/,
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
}, { collection: 'type-precipitation' })

module.exports = mongoose.model('type-precipitation', precipitation)
