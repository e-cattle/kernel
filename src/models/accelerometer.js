'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const accelerometer = new Schema({
    uid:{
        type:String,
        required:true,
        unique: true        
    },
    value:[{
        ax:{
            type:Number,
            required:true
        },
        ay:{
            type:Number,
            required:true
        },
        az:{
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
},{collection: "type-accelerometer"});

module.exports =  mongoose.model ('type-accelerometer', accelerometer);