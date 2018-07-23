'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const heartRate = new Schema({
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
        validate: /^\d{0,3}?$/,
        required:true
    },
    unity: {
        type:String,
        default: "bpm",
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
},{collection: "type-heart-rate"});

module.exports =  mongoose.model ('type-heart-rate', heartRate);