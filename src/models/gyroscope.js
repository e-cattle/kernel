'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const gyroscope = new Schema({
    uid:{
        type:String,
        required:true,
        unique: true        
    },
    value:[{
        gx:{
            type:Number,
            required:true
        },
        gy:{
            type:Number,
            required:true
        },
        gz:{
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
},{collection: "type-gyroscope"});

module.exports =  mongoose.model ('type-gyroscope', gyroscope);