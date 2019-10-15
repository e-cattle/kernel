'use strict'

const mongoose = require('mongoose')

const device = new mongoose.Schema({
  enable: {
    type: Boolean,
    default: false
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
  branch: {
    type: String,
    required: true
  },
  model: {
    type: String,
    required: true
  },
  mac: {
    type: String,
    required: true,
    index: true,
    unique: true
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
  }],
  created: {
    type: Date,
    default: Date.now()
  },
  changed: {
    type: Date,
    default: Date.now()
  }
})

module.exports = mongoose.model('Device', device)
