'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const device = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'porque sem nome?']
  },
  description: {
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
  enable: {
    type: Boolean,
    default: true

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
  syncedAt: {
    type: Date
  },
  hasToSync: {
    type: Boolean,
    default: true
  },
  sensors: [{
    type: {
      type: String,
      required: true
    },
    descriptor: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    }
  }],
  // contract: {
  //     type: Schema.Types.ObjectId,
  //     ref: 'Contract',
  //     required: true
  //   }
});

// device.path('sensors').validate(function(v) {
//     return v.length > 0;
//   });


module.exports = mongoose.model('Device', device);
