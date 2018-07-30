'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const wetBulbTemperature = new Schema({
    uid:{
        type:String,
        required:true,
        unique: true
    },
    value:{
        type:Number,
        min: 0,
        max: 40,
        validate: /^\d{0,2}(\.\d{1,2})?$/,
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
},{collection: "type-wet-bulb-temperature"});

module.exports =  mongoose.model ('type-wet-bulb-temperature', wetBulbTemperature);