'use strict';

const mongoose = require('mongoose');
const Schema =  mongoose.Schema;

const sensorType= new Schema({

    name: {
        type: String,
        required: true, 
        index:true,
        unique:true
    }
    
});

module.exports= mongoose.model('SensorType', sensorType);