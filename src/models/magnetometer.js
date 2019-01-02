'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const magnetometer = new Schema({
    uid:{
        type:String,
        required:true,
        unique: true        
    },
    value:[{
        mx:{
            type:Number,
            required:true
        },
        my:{
            type:Number,
            required:true
        },
        mz:{
            type:Number,
            required:true
        }
    }],
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
},{collection: "type-magnetometer"});

module.exports =  mongoose.model ('type-magnetometer', magnetometer);