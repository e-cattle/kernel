'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const soilTemperature = new Schema({
    deviceId: {
        type: Schema.Types.ObjectId,
        required:true,
    },
    value:{
        type:Number,
        min: 0,
        max: 100,
        validate: /^\d{0,3}(\.\d{1,2})?$/,
        required:true
    },
    date:{
        type:String,
        required:true
    },
    resource: {
        type:String,
        required:false
    },
    dataStorage:{
        type:Date,
        default: Date.now,
        required:true
    },
    syncedAt:{
        type: Date        
    },
},{collection: "type-soil-temperature"});

module.exports =  mongoose.model ('type-soil-temperature', soilTemperature);