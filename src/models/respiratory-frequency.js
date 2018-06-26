'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const respiratoryFrequency = new Schema({
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
        required:true
    },
    unity: {
        type:String,
        default: "bpm",
        required:true
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
},{collection: "type-respiratory-frequency"});

module.exports =  mongoose.model ('type-respiratory-frequency', respiratoryFrequency);