'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const windSpeed = new Schema({
    deviceId: {
        type: Schema.Types.ObjectId,
        required:true,
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
},{collection: "type-wind-speed"});

module.exports =  mongoose.model ('type-wind-speed', windSpeed);