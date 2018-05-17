'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const contract = new Schema({
    apiHost: {
        type: String,
        required: true
    },
    token:{
        type: Date,
        default:Date.now()
    }
});

module.exports = mongoose.model('Config', contract);