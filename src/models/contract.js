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
    }, 
    sensors: [{
        type:{
            type: String,
            required: true
        }, 
        descriptor:{
            type: String,
            required: true
        }, 
        name:{
            type: String,
            required: true
        }
    }],
    devices: [
        {
          type: Schema.Types.ObjectId,
          ref: 'Device'
        }
      ]
});

module.exports = mongoose.model('Contract', contract);