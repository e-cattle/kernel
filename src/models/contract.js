'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const contract = new Schema({
    name: {
        type: String,
        required: true
    },
    date:{
        type: Date,
        default:Date.now()
       
    },

    enable:{
        type: Boolean,
        default:true
       
    },
    device:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Device',
        required: true
    }
});


module.exports = mongoose.model('Contract', contract);