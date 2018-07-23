'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const airTemperature = new Schema({
    uid:{
        type:String,
        required:true,
        unique: true
    }, 
    mac:{
        type:String,
        required:true
    },
    value:{
        type:Number,
        min: -99,
        max: 1999,
        validate: /^-?\d{0,4}(\.\d{1,2})?$/,
        required:true
    },
    unity: {
        type:String,
        default: "ºC",
        required:true
    },
    dateRegister:{
        type:Date,
        required:true
    },
    dataStorage:{
        type:Date,
        default: Date.now,
        required:true
    },
    syncedAt:{
        type: Date        
    },
},{collection: "type-air-temperature"});

module.exports =  mongoose.model ('type-air-temperature', airTemperature);