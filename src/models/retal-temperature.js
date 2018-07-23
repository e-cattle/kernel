'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const retalTemperature = new Schema({
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
        min: 30,
        max: 45,
        validate: /^-?\d{0,2}(\.\d{1,2})?$/,
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
},{collection: "type-retal-temperature"});

module.exports =  mongoose.model ('type-retal-temperature', retalTemperature);