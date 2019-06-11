'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const precipitation = new Schema({
    deviceId: {
        type: Schema.Types.ObjectId,
        required:true
    },
    value:{
        type:Number,
        min: 0,
        validate: /^\d+?$/,
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
},{collection: "type-precipitation"});

module.exports =  mongoose.model ('type-precipitation', precipitation);