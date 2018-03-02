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
    version:{
        type: Number,
        required:true
      
    },
    enable:{
        type: Boolean,
        default:true
    },
    mac: {
        type: String,
        required: true,  
        index: true     
    }, sensors: [{
        type:{
            type: String,
            required: true
        }, 
        descriptor:{
            type: String,
            required: true
        }, 
        unix:{
            type: String,
            required: true
        }
    }]
});

module.exports = mongoose.model('Contract', contract);