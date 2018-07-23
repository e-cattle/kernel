'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const relativeHumidity = new Schema({
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
        min: 0,
        max: 100,
        validate: /^\d{0,3}(\.\d{1,2})?$/,
        required:true
    },
    unity: {
        type:String,
        default: "%",
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
},{collection: "type-relative-humidity"});

module.exports =  mongoose.model ('type-relative-humidity', relativeHumidity);