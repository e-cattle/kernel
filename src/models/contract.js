'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const contract = new Schema({
  device: {
    type: Schema.Types.ObjectId,
    ref: 'Device',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  local: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  version: {
    type: Number,
    required: true
  },
  sensors: [{
    type: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    label: {
      type: String
    },
    description: {
      type: String,
      required: true
    }
  }]
})

module.exports = mongoose.model('Contract', contract)
