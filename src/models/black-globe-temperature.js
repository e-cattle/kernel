'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const blackGlobeTemperature = new Schema({
    uid:{
        type:String,
        required:true,
        unique: true
    },
    value:{
        type:Number,
        min: -50,
        max: 100,
        validate: /^-?\d{0,3}(\.\d{1,2})?$/,
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
},{collection: "type-black-globe-temperature"});

module.exports =  mongoose.model ('type-black-globe-temperature', blackGlobeTemperature);