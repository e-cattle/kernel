'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const contract = new Schema({
    name: {
        type: String,
        required: true
    },

    enable:{
        type: Boolean,
        default:true
       
    },
    type:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Device',
        required: true
    }

});


module.exports = mongoose.model('Constract', contract);