'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const contract = new Schema({
  device: {
    type: Schema.Types.ObjectId,
    ref: 'Device'
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
  mac: {
    type: String,
    required: true,
    index: true,
    unique: true
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
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    }
  }]
})

module.exports = mongoose.model('Contract', contract)
