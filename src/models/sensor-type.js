'use strict';

const mongoose = require('mongoose');
const Schema =  mongoose.Schema;

const sensorType= new Schema({
    name: {
        type: String,
        required: true, 
        index:true,
        unique:true
    }, 
    description:{
        type: String,
        required: true  
    }
});

module.exports= mongoose.model('SensorType', sensorType);