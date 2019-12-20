'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const animalWeight = new Schema({
  device: {
    type: Schema.Types.ObjectId,
    ref: 'Device',
    required: true
  },
  value: {
    type: Number,
    min: 10,
    max: 1999,
    validate: /^\d{0,4}(\.\d{1,2})?$/,
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
}, { collection: 'type-animal-weight' })

module.exports = mongoose.model('type-animal-weight', animalWeight)
