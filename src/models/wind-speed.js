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
    value:[{
        speed:{
            type:Number,
            min: 0,
            max: 125,
            validate: /^\d{0,3}(\.\d{1,2})?$/,            
            required:true
        },
        direction:{
            type:String,
            required:false
        }
    }],
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
},{collection: "type-wind-speed"});

module.exports =  mongoose.model ('type-wind-speed', windSpeed);