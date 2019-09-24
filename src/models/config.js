'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const config = new Schema({
  name: {
    type: String
  },
  apiAddress: {
    type: String
  },
  apiAddressProtocol: {
    type: String
  },
  token: {
    type: String
  }
});

module.exports = mongoose.model('Config', config);
