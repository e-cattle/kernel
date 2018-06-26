'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const windSpeed = new Schema({
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
        speed:{
            type:Number,
            default: "m/s",
            required:true
        },
        direction:{
            type:String,
            required:false
        }
    },
    dateRegister:{
        type:Date,
        default: Date.now,
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
},{collection: "type-wind-speed"});

module.exports =  mongoose.model ('type-wind-speed', windSpeed);