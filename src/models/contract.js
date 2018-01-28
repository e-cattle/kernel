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
 
    mac: {
        type: String,
        required: true,  
        index: true,
        unique: true
    }
});


module.exports = mongoose.model('Constract', contract);